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
  
  const $recover = $("#recRecoverActions");
  const $btnRetry = $("#btnRetryUpload");
  const $btnDl = $("#btnDownloadRecording");

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
  //helper recovery functions///
  function hideRecoveryActions() {
    $recover.hide();
    $btnRetry.hide().prop("disabled", true).removeData("localId");
    $btnDl.hide().attr("href", "#").attr("download", "encounter.webm").removeData("localId");
  }

  async function enableDownloadForLocalId(localId) {
    try {
      const rec = await idbGetRecording(localId);
      if (!rec || !rec.blob) throw new Error("Local recording not found.");

      const dlUrl = URL.createObjectURL(rec.blob);

      // If we call this multiple times, revoke previous to avoid leaks
      const prev = $btnDl.data("dlUrl");
      if (prev) { try { URL.revokeObjectURL(prev); } catch(e) {} }

      $btnDl
        .data("dlUrl", dlUrl)
        .data("localId", localId)
        .attr("href", dlUrl)
        .attr("download", (rec.meta && rec.meta.origName) ? rec.meta.origName : "encounter.webm")
        .show();

      $recover.show();
    } catch (e) {
      console.warn("Enable download failed:", e);
    }
  }
  //helper blob functions///
  function getBlobDurationSeconds(blob) {
    return new Promise(function (resolve, reject) {
      try {
        const a = document.createElement("audio");
        a.preload = "metadata";
        a.onloadedmetadata = function () {
          // Chrome sometimes reports Infinity until you poke currentTime
          if (isFinite(a.duration) && a.duration > 0) return resolve(a.duration);

          a.currentTime = 1e101;
          a.ontimeupdate = function () {
            a.ontimeupdate = null;
            resolve(a.duration || 0);
          };
        };
        a.onerror = function () { reject(new Error("Could not read audio duration")); };

        a.src = URL.createObjectURL(blob);
      } catch (e) {
        reject(e);
      }
    });
  }

  async function blobHasSound(blob, opts) {
    opts = opts || {};
    const threshold = (opts.threshold != null) ? opts.threshold : 0.008; // tweak: 0.005–0.02
    const maxSecondsToScan = opts.maxSecondsToScan || 20;               // don’t scan huge files fully
    const sampleStep = opts.sampleStep || 40;                           // higher = faster, less accurate

    // Decode audio
    const arrayBuf = await blob.arrayBuffer();

    // Safari requires AudioContext to be created from user gesture; here we are still in stopAndUpload click => OK
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) throw new Error("WebAudio not supported");

    const ctx = new AudioCtx();

    let audioBuf;
    try {
      audioBuf = await ctx.decodeAudioData(arrayBuf.slice(0));
    } finally {
      // keep it clean
      try { await ctx.close(); } catch (e) {}
    }

    if (!audioBuf || audioBuf.length === 0) return false;

    const sr = audioBuf.sampleRate;
    const scanLen = Math.min(audioBuf.length, Math.floor(maxSecondsToScan * sr));
    const channels = audioBuf.numberOfChannels || 1;

    // Compute peak RMS across channels over first N seconds
    let maxRms = 0;

    for (let ch = 0; ch < channels; ch++) {
      const data = audioBuf.getChannelData(ch);

      // Scan with downsampling for speed
      let sumSq = 0;
      let count = 0;
      for (let i = 0; i < scanLen; i += sampleStep) {
        const v = data[i] || 0;
        sumSq += v * v;
        count++;
      }
      const rms = Math.sqrt(sumSq / Math.max(1, count));
      if (rms > maxRms) maxRms = rms;
    }

    // If max RMS is above threshold, there is meaningful signal (voice/noise)
    return maxRms >= threshold;
  }


  ///

  //HELPERS DATA PLACEMENT IN FORM//
  //////////////////////////////////
  function fillOrthoticsPanel(o) {
    if (!o) return;

    function setTagsByName(name, value) {
      var $el = $("#orthotics_history").find("input[name='" + name + "']").first();
      if (!$el.length) return;

      var hasPlugin = !!$el.data('tagsinput') || (typeof $el.tagsinput === "function");

      // normalize to single tag (string)
      var tag = (value == null) ? "" : String(value).trim();

      if (hasPlugin) {
        try { $el.tagsinput('removeAll'); } catch (e) {}
        if (tag) {
          try { $el.tagsinput('add', tag); } catch (e) {}
        }
        $el.trigger("change");
      } else {
        $el.val(tag).trigger("input").trigger("change");
      }
    }

    setTagsByName("type", o.type);
    setTagsByName("origin", o.origin);
    setTagsByName("since", o.since);
    setTagsByName("effect", o.effect);
    setTagsByName("notes", o.notes);
    setTagsByName("heel_lift", o.heel_lift);
  }
  function fillFamilyHistory(family) {
    if (!Array.isArray(family) || !family.length) return;

    var $list = $('#familyhistory_list, .familyhistory, .family_history').first();
    if (!$list.length) {
      console.warn('Family history list not found');
      return;
    }

    family.forEach(function (item) {
      if (!item || !item.condition) return;

      // find first empty row (condition empty)
      var $li = null;

      $list.find('li').each(function () {
        var $cond = $(this).find('input.condition');
        if ($cond.length && !$cond.val()) {
          $li = $(this);
          return false; // break
        }
      });

      // if none empty, clone last row
      if (!$li) {
        var $last = $list.find('li:last');
        if (!$last.length) return;

        $li = $last.clone(true, true);
        $li.find('input').val('');
        $list.append($li);
      }

      // fill values
      $li.find('input.condition')
        .val(item.condition)
        .trigger('input')
        .trigger('change');

      $li.find('input.relationship')
        .val(item.relationship || '')
        .trigger('input')
        .trigger('change');
    });
  }
  function fillSocialHistory(social) {
    social = social || {};

    // tagsinput helper (same idea as complaints)
    function setTags($el, values) {
      if (!$el || !$el.length) return;

      // normalize to array of tags
      if (values == null) values = [];
      if (typeof values === "string") {
        values = values.split(",").map(s => s.trim()).filter(Boolean);
      }
      if (!Array.isArray(values)) values = [String(values)];

      var hasPlugin = !!$el.data('tagsinput') || (typeof $el.tagsinput === "function");

      if (hasPlugin) {
        try { $el.tagsinput('removeAll'); } catch (e) {}
        values.forEach(function (t) {
          if (!t) return;
          try { $el.tagsinput('add', t); } catch (e) {}
        });
        $el.trigger("change");
      } else {
        // fallback if tagsinput not initialized yet
        $el.val(values.join(", ")).trigger("input").trigger("change");
      }
    }

    // convenience: find by name within the page (or scope to a container if you have one)
    function $byName(n) {
      return $("input[name='" + n + "']").first();
    }

    // profession / sport / smoking / drinking / sleeping are tagsinput
    setTags($byName("profession"), social.profession ? [social.profession] : []);
    setTags($byName("sport"),      social.sport ? [social.sport] : []);
    setTags($byName("smoking"),    social.smoking ? [social.smoking] : []);
    setTags($byName("drinking"),   social.drinking ? [social.drinking] : []);
    setTags($byName("sleeping"),   social.sleeping ? [social.sleeping] : []);

    // retired checkbox (optional support if your AI later returns it)
    if (typeof social.retired !== "undefined") {
      $("input[name='retired'], .retired").prop("checked", !!social.retired).trigger("change");
    }
  }
  function setTagsInput($el, values) {
    if (!$el || !$el.length) return;

    // normalize to array
    if (typeof values === "string") {
      values = values.split(",").map(s => s.trim()).filter(Boolean);
    }
    if (!Array.isArray(values)) values = [];

    // tagsinput plugin instance exists after $('.tagsinput').tagsinput()
    const hasPlugin = !!$el.data('tagsinput') || (typeof $el.tagsinput === "function");

    if (!hasPlugin) {
      // fallback (if plugin not init yet)
      $el.val(values.join(", ")).trigger("input").trigger("change");
      return;
    }

    try { $el.tagsinput('removeAll'); } catch (e) {}

    values.forEach(function(v) {
      try { $el.tagsinput('add', v); } catch (e) {}
    });

    // keep underlying input in sync for your Complaint.save handler
    $el.trigger("change");
  }
  function setField($el, v) {
    if (!$el || !$el.length) return;
    $el.val(v || "").trigger("input").trigger("change");
  }
  function ensureEmptyPmhRow() {
    // if an empty row exists (condition empty), do nothing
    let hasEmpty = false;
    $(".pmh li").each(function () {
      const condition = $(this).find(".condition").val();
      if (!condition || condition.toString().trim() === "") hasEmpty = true;
    });
    if (hasEmpty) return;

    // clone last row as template + clear values
    const $last = $(".pmh li").last();
    if (!$last.length) return;

    const $clone = $last.clone();

    $clone.find("input").each(function () {
      const $i = $(this);
      if ($i.is(":checkbox")) $i.prop("checked", false);
      else $i.val("");
    });

    // append to the UL (adjust selector if your UL is different)
    $(".pmh").append($clone);
  }

  function applyAiPmhToList(aiPmh) {
    if (!Array.isArray(aiPmh) || aiPmh.length === 0) return;

    aiPmh.forEach(function (item) {
      if (!item || !item.condition) return;

      // ensure there's an empty row to fill
      ensureEmptyPmhRow();

      // pick first empty row (condition empty)
      let $target = null;
      $(".pmh li").each(function () {
        if ($target) return;
        const cond = $(this).find(".condition").val();
        if (!cond || cond.toString().trim() === "") $target = $(this);
      });

      if (!$target || !$target.length) return;

      // fill it
      const year = (item.year === null || typeof item.year === "undefined") ? "" : item.year.toString();
      $target.find(".year").val(year);
      $target.find(".condition").val(item.condition);

      // leave flags unchecked (AI doesn't set those)
      $target.find(".redflag").prop("checked", false);
      $target.find(".yellowflag").prop("checked", false);
    });

    // Trigger your existing save logic once (it loops all LI's and saves JSON)
    $(".pmh li .condition").first().trigger("change");
  }
  Patient.Helpers.addComplaintPane = function addComplaintPane(prefill) {
    // prefill = object from AI: { chief_complaint, associated_complaints[], location, onset, duration, timing, intensity, character, aggravating_factors[], relieving_factors[], previous_treatments, note }

    return new Promise(function (resolve, reject) {
      // use state if available; fallback to existing globals for now
      var oEncounter = (Patient.State && Patient.State.oEncounter) ? Patient.State.oEncounter : window.oEncounter;

      if (!oEncounter || !oEncounter.id) {
        return reject(new Error("Missing oEncounter (Patient.State.oEncounter)"));
      }

      Complaint.add({
        encounter_id: oEncounter.id,
        patient_id: oEncounter.patient_id,
        user: oEncounter.user,
        open: moment().format(),
        active: 1
      }, function (complaint) {

        try {
          var pane_id = 'complaint_' + complaint.id;

          var rendered = Mustache.render(Patient.Templates.complaint, {
            complaint_id: complaint.id,
            patient_id: oEncounter.patient_id,
            encounter_id: oEncounter.id,
            diagnosis_id: 1,
            diagnosis: 'no diagnosis',
            pane_id: pane_id,
            wrapped: function () {
              return function (text) {
                return text
                  .replace('value="' + this.intensity + '"', 'value="' + this.intensity + '" checked')
                  .replace(/{{complaint_id}}/g, this.complaint_id);
              };
            }
          });

          var rendered2 = Mustache.render(Patient.Templates.complaint_tab, {
            pane_name: pane_id,
            tab_title: (prefill && prefill.chief_complaint) ? prefill.chief_complaint : 'new complaint',
            complaint_tab_id: 'tab_' + pane_id
          });

          $('#complaints_panes').append(rendered);
          $('#complaints_tabs').append(rendered2);

          // set diagnosis default
          var form = $('#' + pane_id + ' .form_diagnosis');
          if (Patient.Helpers.saveDiagnosis) {
            Patient.Helpers.saveDiagnosis(form);
          }

          // select new complaint tab
          $('#tab_' + pane_id).tab('show');

          // init plugins (scope to pane)
          $('#' + pane_id + ' .tagsinput').tagsinput();

          // wire events (pane-scoped; don't unbind others globally)
          $('#' + pane_id + ' .btn-open-diagnoses-modal').off('click').on('click', function () {
            Patient.State.formDiagnosis = $(this.form);
            $("#diagnosesModal").modal("show");
          });

          $('#' + pane_id + ' .form_diagnosis .form-control').off('change').on('change', function () {
            if (Patient.Helpers.saveDiagnosis) {
              Patient.Helpers.saveDiagnosis($(this.form));
            }
            if (Patient.State) Patient.State.fAllSaved = 0;
          });

          // ✅ PREFILL FROM AI (expects fillComplaintForm to be global or namespaced)
          if (prefill) {
            if (Patient.Helpers.fillComplaintForm) {
              Patient.Helpers.fillComplaintForm(pane_id, prefill);
            } else if (typeof window.fillComplaintForm === "function") {
              window.fillComplaintForm(pane_id, prefill);
            } else {
              console.warn("fillComplaintForm not found; prefill skipped");
            }
          }

          // focus first element
          $('#' + pane_id + ' .cc').focus();

          resolve({ complaint: complaint, pane_id: pane_id });
        } catch (e) {
          reject(e);
        }
      });
    });
  };
  

  Patient.Helpers.fillComplaintForm = function fillComplaintForm(pane_id, c) {
    c = c || {};
    var $pane = $('#' + pane_id);

    // ---- helpers ----
    function setVal($el, v) {
      if (!$el || !$el.length) return;
      $el.val(v || "").trigger("input").trigger("change");
    }

    function setTags($el, values) {
      if (!$el || !$el.length) return;

      // normalize to array
      if (values == null) values = [];
      if (typeof values === "string") {
        values = values.split(",").map(function (s) { return s.trim(); }).filter(Boolean);
      }
      if (!Array.isArray(values)) values = [String(values)];

      // if tagsinput plugin is active, use its API so the UI updates
      var hasPlugin = !!$el.data('tagsinput') || (typeof $el.tagsinput === "function");
      if (hasPlugin) {
        try { $el.tagsinput('removeAll'); } catch (e) {}
        values.forEach(function (t) {
          if (!t) return;
          try { $el.tagsinput('add', t); } catch (e) {}
        });
        $el.trigger("change");
      } else {
        // fallback (plugin not initialized yet)
        setVal($el, values.join(", "));
      }
    }

    // ---- core fields ----
    setVal($pane.find('.cc'), c.chief_complaint);

    // Associated complaints is NOT tagsinput in your template (plain input .ac)
    setVal($pane.find('.ac'), (c.associated_complaints || []).join(", "));

    setVal($pane.find('.location'), c.location);
    setVal($pane.find('.onset'), c.onset);
    setVal($pane.find('.timing'), c.timing);

    // ---- tagsinput fields in your template ----
    // character/aggravating/relieving/previous_treatments are tagsinput-enabled
    // If AI returns character/previous_treatments as strings, store them as a single tag
    setTags($pane.find('.character'), c.character ? [c.character] : []);
    setTags($pane.find('.aggravating'), c.aggravating_factors || []);
    setTags($pane.find('.relieving'), c.relieving_factors || []);
    setTags($pane.find('.previous_treatments'), c.previous_treatments ? [c.previous_treatments] : []);

    // Note is a textarea
    setVal($pane.find('textarea.note, .note'), c.note);

    // ---- intensity radios ----
    if (c.intensity != null && c.intensity !== "") {
      var val = c.intensity.toString().trim();
      var m = val.match(/^(\d+)\s*\/\s*10$/);
      if (m) val = m[1];

      // clear within pane to avoid leftovers
      $pane.find('input[type="radio"][name="intensity"]').prop('checked', false);

      var $radio = $pane.find('input[type="radio"][name="intensity"][value="' + val.replace(/"/g, '\\"') + '"]');
      if ($radio.length) $radio.prop('checked', true).trigger("change");
    }

    // NOTE: do NOT blanket-trigger change on all radios; it can overwrite intensity to 10.
  };
  //////////////////////
  ////////////////////

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

  $("#recUploadFile").on("change", async function () {
    const file = this.files && this.files[0];
    if (!file) return;

    setStatus("Uploading " + file.name + "…");

    try {
      await uploadBlob(file, "upload_" + Date.now());
      $("#recordEncounterModal").modal("hide");
    } catch (e) {
      console.error(e);
      setStatus("Upload failed");
    }
  });

  async function uploadBlob(blob, localId) {
    setStatus("Uploading & generating…");
    setButtons("uploading");

    const soap_only = $("#recSoapOnly").is(":checked") ? 1 : 0;

    const fd = new FormData();
    fd.append("com", "patient");
    fd.append("task", "processEncounterRecording");
    //fd.append("mock", "1");
    fd.append("local_id", localId || ""); // optional, useful for logs/idempotency
    fd.append("audio", blob, "encounter.webm");
    fd.append("soap_only", soap_only);

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

    // NEW response format from backend:
    // { soap: {subjective, objective, assessment, plan}, complaint, pmh, family_history, social }

    const soap = (data && data.soap) ? data.soap : {};
    
    $("#subjective").val(soap.subjective || "");
    $("#objective").val(soap.objective || "");
    $("#assessment").val(soap.assessment || "");
    $("#plan").val(soap.plan || "");

    
    if (!soap_only) {
      const complaint = data ? (data.complaint || null) : null;
      const pmh = data ? (data.pmh || []) : [];
      const family_history = data ? (data.family_history || []) : [];
      const social = data ? (data.social || {}) : {};
      const orthotics = data ? (data.orthotics || null) : null;

      applyAiPmhToList(pmh || []);
      if (complaint) {
      Patient.Helpers.addComplaintPane(complaint);
      }
      fillSocialHistory(social || {});
      fillFamilyHistory(data.family_history || []);
      fillOrthoticsPanel(orthotics);
    }

    // optional: expose to window for quick inspection in console
    //window._encounterExtract = { soap, complaint, pmh, family_history, social };

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

    hideRecoveryActions();

    // ✅ Quick sanity checks BEFORE upload
    try {
      // size guard (optional)
      if (!blob || blob.size < 20 * 1024) { // <20KB is basically nothing
        setStatus("Recording is empty / too short. Please try again.");
        setButtons("ready");
        return;
      }

      const dur = await getBlobDurationSeconds(blob);
      if (!dur || dur < 1.5) {
        setStatus("Recording too short (" + (dur ? dur.toFixed(1) : "0") + "s). Please record again.");
        setButtons("ready");
        return;
      }
    } catch (e) {
      // If duration detection fails, don't block upload
      console.warn("Duration check failed:", e);
    }

    // ✅ Sound presence check BEFORE saving/uploading
    try {
      const hasSound = await blobHasSound(blob, { threshold: 0.008, maxSecondsToScan: 15, sampleStep: 40 });
      if (!hasSound) {
        setStatus("No audible sound detected. Check microphone and record again.");
        setButtons("ready");
        return;
      }
    } catch (e) {
      // If decoding fails (often Safari + webm/opus), don’t block upload — fallback to duration/size checks
      console.warn("Sound check failed (fallback):", e);
    }

    // ✅ Save locally BEFORE uploading (prevents "boem all is lost")
    currentLocalId = newLocalId();
    try {
      await idbPutRecording(currentLocalId, blob, { origName: "encounter.webm" });
      setStatus("Saved locally. Uploading & generating…");
    } catch (e) {
      // If IndexedDB fails, still attempt upload, but warn user.
      console.warn("IndexedDB save failed:", e);
      setStatus("Uploading & generating… (local backup unavailable)");
    }

    try {
      await uploadBlob(blob, currentLocalId);

      // ✅ On success: remove local backup
      try { if (currentLocalId) await idbDeleteRecording(currentLocalId); } catch (e) {}
      currentLocalId = null;

      setStatus("Done. Data filled in.");
      $modal.modal("hide");
    } catch (e) {
      console.error(e);

      setStatus("Upload failed, but the recording is saved locally. Retry, or download it to disk.");
      setButtons("ready");

      $btnRetry
        .data("localId", currentLocalId)
        .prop("disabled", false)
        .show();

      $recover.show();
      await enableDownloadForLocalId(currentLocalId);
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

      setStatus("Done. Data filled in.");
      $modal.modal("hide");
    } catch (e) {
      console.error(e);
      setStatus("Retry failed. Recording is still saved locally. Try again later, or download it now.");
      $(this).prop("disabled", false).show();
      setButtons("ready");
      await enableDownloadForLocalId(localId);
    }
  });
  // download file locally
    // Force download on click (more reliable than relying only on <a download>)
  $btnDl.on("click", async function (e) {
    e.preventDefault();

    const localId = $(this).data("localId");
    if (!localId) {
      console.warn("Download clicked but no localId");
      return;
    }

    try {
      function safeName(s) {
        return String(s || "")
          .trim()
          .replace(/\s+/g, "_")
          .replace(/[^a-zA-Z0-9_\-]/g, ""); // remove weird chars
      }
      const surname = safeName(oPatient && oPatient.patient_surname);
      const firstname = safeName(oPatient && oPatient.patient_firstname);
      const encId = safeName(oEncounter && oEncounter.id);


      const rec = await idbGetRecording(localId);
      if (!rec || !rec.blob) throw new Error("Local recording not found.");

      const blob = rec.blob;

      // keep extension from original name if possible
      let ext = "webm";
      if (rec.meta && rec.meta.origName) {
        const m = String(rec.meta.origName).toLowerCase().match(/\.([a-z0-9]{2,5})$/);
        if (m) ext = m[1];
      }

      const filename = `encounter_${surname}${firstname ? firstname : ""}_${encId || "unknown"}.${ext}`;
      
      
      //const filename = (rec.meta && rec.meta.origName) ? rec.meta.origName : "encounter.webm";

      const url = URL.createObjectURL(blob);

      // create a temporary anchor and click it
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();

      // revoke after a short delay (Safari needs a moment)
      setTimeout(() => {
        try { URL.revokeObjectURL(url); } catch (err) {}
      }, 1500);

    } catch (err) {
      console.error("Download failed:", err);
      setStatus("Download failed (recording not found locally).");
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

    // cleanup any download objectURL
    const prev = $btnDl.data("dlUrl");
    if (prev) { try { URL.revokeObjectURL(prev); } catch(e) {} }
    hideRecoveryActions();

    // NOTE: we intentionally do NOT delete currentLocalId here.
    // If upload failed, user might close modal and retry later.
    setStatus("Ready.");
    setButtons("ready");
  });
});