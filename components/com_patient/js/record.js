// record.js
$(document).ready(function () {
  let mediaRecorder = null;
  let chunks = [];
  let stream = null;
  let isRecording = false;

  let currentLocalId = null; // local persistence id for retry

  const $modal  = $("#recordEncounterModal");
  const $status = $("#recStatus");
  const $audio  = $("#recPlayback");

  // Make sure you have this button in your modal:
  // <button id="btnRetryUpload" class="btn btn-warning" style="display:none" disabled>Retry upload</button>
  const $btnRetry = $("#btnRetryUpload");

  function setStatus(t) { $status.text(t); }

  function setButtons(state) {
    // state: ready | recording | paused | uploading
    $("#btnRecStart").prop("disabled", state !== "ready");
    $("#btnRecPause").prop("disabled", state !== "recording");
    $("#btnRecResume").prop("disabled", state !== "paused");
    $("#btnRecDone").prop("disabled", (state !== "recording" && state !== "paused"));
  }

  /* =====================================================
     IndexedDB helpers (store blobs locally for retry)
     ===================================================== */
  function idbOpen() {
    return new Promise(function (resolve, reject) {
      if (!window.indexedDB) return reject(new Error("IndexedDB not supported"));

      const req = indexedDB.open("encounterRecordingsDB", 1);

      req.onupgradeneeded = function () {
        const db = req.result;
        if (!db.objectStoreNames.contains("recordings")) {
          db.createObjectStore("recordings", { keyPath: "id" });
        }
      };

      req.onsuccess = function () { resolve(req.result); };
      req.onerror = function () { reject(req.error || new Error("IndexedDB open error")); };
    });
  }

  function idbPutRecording(id, blob, meta) {
    return idbOpen().then(function (db) {
      return new Promise(function (resolve, reject) {
        const tx = db.transaction("recordings", "readwrite");
        tx.objectStore("recordings").put({
          id: id,
          blob: blob,
          meta: meta || {},
          createdAt: Date.now()
        });
        tx.oncomplete = function () { resolve(true); };
        tx.onerror = function () { reject(tx.error || new Error("IndexedDB put error")); };
      });
    });
  }

  function idbGetRecording(id) {
    return idbOpen().then(function (db) {
      return new Promise(function (resolve, reject) {
        const tx = db.transaction("recordings", "readonly");
        const req = tx.objectStore("recordings").get(id);
        req.onsuccess = function () { resolve(req.result || null); };
        req.onerror = function () { reject(req.error || new Error("IndexedDB get error")); };
      });
    });
  }

  function idbDeleteRecording(id) {
    return idbOpen().then(function (db) {
      return new Promise(function (resolve, reject) {
        const tx = db.transaction("recordings", "readwrite");
        tx.objectStore("recordings").delete(id);
        tx.oncomplete = function () { resolve(true); };
        tx.onerror = function () { reject(tx.error || new Error("IndexedDB delete error")); };
      });
    });
  }

  function newLocalId() {
    return "enc_" + Date.now() + "_" + Math.random().toString(16).slice(2);
  }

  async function startRecording() {
    try {
      // Hide retry when starting a new session
      $btnRetry.hide().prop("disabled", true).removeData("localId");

      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunks = [];

      const preferred = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/mp4" // some Safari variants
      ];
      const mimeType = preferred.find(t => window.MediaRecorder && MediaRecorder.isTypeSupported(t)) || "";

      mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);

      mediaRecorder.ondataavailable = function (e) {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstart = function () {
        isRecording = true;
        setStatus("Recording…");
        setButtons("recording");
      };

      mediaRecorder.onpause = function () {
        setStatus("Paused.");
        setButtons("paused");
      };

      mediaRecorder.onresume = function () {
        setStatus("Recording…");
        setButtons("recording");
      };

      mediaRecorder.onstop = function () {
        isRecording = false;
      };

      mediaRecorder.start(250);
    } catch (err) {
      console.error(err);
      setStatus("Microphone permission denied or unavailable.");
      setButtons("ready");
    }
  }

  function pauseRecording() {
    if (mediaRecorder && isRecording && mediaRecorder.state === "recording") mediaRecorder.pause();
  }

  function resumeRecording() {
    if (mediaRecorder && mediaRecorder.state === "paused") mediaRecorder.resume();
  }

  async function uploadBlob(blob, localId) {
    setStatus("Uploading & generating SOAP…");
    setButtons("uploading");

    const fd = new FormData();
    fd.append("com", "patient");
    fd.append("task", "processEncounterRecording");
    fd.append("local_id", localId || ""); // optional, useful for logs/idempotency
    fd.append("audio", blob, "encounter.webm");

    const resp = await fetch("ajax.php", {
      method: "POST",
      body: fd
    });

    if (!resp.ok) {
      const txt = await resp.text();
      throw new Error(txt || "Upload failed");
    }

    const data = await resp.json();

    // your debugging helper
    try { if (typeof log === "function") log(data); } catch (e) {}

    $("#subjective").val(data.subjective || "");
    $("#objective").val(data.objective || "");
    $("#assessment").val(data.assessment || "");
    $("#plan").val(data.plan || "");

    return data;
  }

  async function stopAndUpload() {
    if (!mediaRecorder) return;

    setStatus("Finalizing audio…");
    setButtons("uploading");

    await new Promise((resolve) => {
      const prevOnStop = mediaRecorder.onstop;
      mediaRecorder.onstop = function () {
        try { if (typeof prevOnStop === "function") prevOnStop(); } catch (e) {}
        resolve();
      };
      mediaRecorder.stop();
    });

    if (stream) stream.getTracks().forEach(t => t.stop());

    const blob = new Blob(chunks, { type: (chunks[0] && chunks[0].type) ? chunks[0].type : "audio/webm" });
    const url = URL.createObjectURL(blob);
    $audio.attr("src", url).show();

    // ✅ Save locally BEFORE uploading (prevents "boem all is lost")
    currentLocalId = newLocalId();
    try {
      await idbPutRecording(currentLocalId, blob, { origName: "encounter.webm" });
      setStatus("Saved locally. Uploading & generating SOAP…");
    } catch (e) {
      // If IndexedDB fails, still attempt upload, but warn user.
      console.warn("IndexedDB save failed:", e);
      setStatus("Uploading & generating SOAP… (local backup unavailable)");
    }

    try {
      await uploadBlob(blob, currentLocalId);

      // ✅ On success: remove local backup
      try { if (currentLocalId) await idbDeleteRecording(currentLocalId); } catch (e) {}
      currentLocalId = null;

      setStatus("Done. SOAP filled in.");
      $modal.modal("hide");
    } catch (e) {
      console.error(e);

      // ✅ Keep local recording for retry
      setStatus("Upload failed, but the recording is saved locally. Please retry.");
      setButtons("ready");

      $btnRetry
        .data("localId", currentLocalId)
        .prop("disabled", false)
        .show();
    }
  }

  // Retry handler
  $btnRetry.on("click", async function () {
    const localId = $(this).data("localId");
    if (!localId) return;

    $(this).prop("disabled", true);
    setStatus("Retrying upload…");

    try {
      const rec = await idbGetRecording(localId);
      if (!rec || !rec.blob) throw new Error("Local recording not found.");

      await uploadBlob(rec.blob, localId);

      // cleanup
      try { await idbDeleteRecording(localId); } catch (e) {}
      currentLocalId = null;

      setStatus("Done. SOAP filled in.");
      $modal.modal("hide");
    } catch (e) {
      console.error(e);
      setStatus("Retry failed. Recording is still saved locally. Try again when internet is back.");
      $(this).prop("disabled", false).show();
      setButtons("ready");
    }
  });

  // Open modal
  $(document).on("click", ".btn_record_encounter", function () {
    setStatus("Ready.");
    setButtons("ready");
    $audio.hide().attr("src", "");

    // reset retry button
    $btnRetry.hide().prop("disabled", true).removeData("localId");
    currentLocalId = null;

    $modal.modal("show");
  });

  $("#btnRecStart").on("click", startRecording);
  $("#btnRecPause").on("click", pauseRecording);
  $("#btnRecResume").on("click", resumeRecording);
  $("#btnRecDone").on("click", stopAndUpload);

  // Reset if modal closed mid-recording (Bootstrap 3 uses hidden.bs.modal)
  $modal.on("hidden.bs.modal hidden", function () {
    try {
      if (mediaRecorder && (mediaRecorder.state === "recording" || mediaRecorder.state === "paused")) {
        mediaRecorder.stop();
      }
    } catch (e) {}

    try { if (stream) stream.getTracks().forEach(t => t.stop()); } catch (e) {}

    mediaRecorder = null;
    stream = null;
    chunks = [];
    isRecording = false;

    // NOTE: we intentionally do NOT delete currentLocalId here.
    // If upload failed, user might close modal and retry later.
    setStatus("Ready.");
    setButtons("ready");
  });
});