<?php

class Ai {

    public static function processEncounterRecording($tmpPath, $origName) {

         $apiKey = get_option('openai_api_key');

        if (!$apiKey) {
            http_response_code(500);
            echo json_encode(["error" => "Missing OPENAI_API_KEY"]);
            exit;
        }

        /* =====================================================
           1) TRANSCRIBE AUDIO
           ===================================================== */
        $ch = curl_init("https://api.openai.com/v1/audio/transcriptions");

        $post = [
            "model" => "gpt-4o-mini-transcribe",
            "file"  => new CURLFile($tmpPath, mime_content_type($tmpPath), $origName),
            "response_format" => "json"
        ];

        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $post,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => [
                "Authorization: Bearer {$apiKey}",
            ]
        ]);

        $transcribeRaw = curl_exec($ch);
        $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($transcribeRaw === false || $code >= 300) {
            http_response_code(500);
            echo json_encode([
                "error" => "Transcription failed",
                "details" => $transcribeRaw
            ]);
            exit;
        }

        $transcribeJson = json_decode($transcribeRaw, true);
        $transcript = trim($transcribeJson['text'] ?? '');

        if (!$transcript) {
            http_response_code(500);
            echo json_encode([
                "error" => "Empty transcript",
                "details" => $transcribeJson
            ]);
            exit;
        }

        /* =====================================================
           2) GENERATE SOAP (STRUCTURED OUTPUTS)
           ===================================================== */
        $payload = [
            "model" => "gpt-4o",
            "input" => [
                [
                    "role" => "system",
                    "content" =>
                        "You are a medical scribe. " .
                        "Only use information explicitly present in the transcript. " .
                        "Do NOT invent PMH, medications, vitals, diagnoses, or findings."
                ],
                [
                    "role" => "user",
                    "content" =>
                        "Turn this transcript into a SOAP note in Dutch:\n\n" . $transcript
                ]
            ],
            "text" => [
                "format" => [
                    "type"   => "json_schema",
                    "name"   => "soap_note",        // ✅ REQUIRED
                    "strict" => true,
                    "schema" => [
                        "type" => "object",
                        "additionalProperties" => false,
                        "properties" => [
                            "subjective" => ["type" => "string"],
                            "objective"  => ["type" => "string"],
                            "assessment" => ["type" => "string"],
                            "plan"       => ["type" => "string"]
                        ],
                        "required" => [
                            "subjective",
                            "objective",
                            "assessment",
                            "plan"
                        ]
                    ]
                ]
            ],
            "store" => false
        ];

        $ch = curl_init("https://api.openai.com/v1/responses");
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => [
                "Authorization: Bearer {$apiKey}",
                "Content-Type: application/json",
            ],
            CURLOPT_POSTFIELDS => json_encode($payload),
        ]);

        $respRaw = curl_exec($ch);
        $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($respRaw === false || $code >= 300) {
            http_response_code(500);
            echo json_encode([
                "error" => "SOAP generation failed",
                "details" => $respRaw
            ]);
            exit;
        }

        $resp = json_decode($respRaw, true);

        /* =====================================================
           3) EXTRACT STRUCTURED JSON FROM RESPONSE
           ===================================================== */
        $soapText = null;

        if (isset($resp["output"]) && is_array($resp["output"])) {
            foreach ($resp["output"] as $o) {
                if (($o["type"] ?? "") === "message") {
                    foreach (($o["content"] ?? []) as $c) {
                        if (($c["type"] ?? "") === "output_text") {
                            $soapText = $c["text"] ?? null;
                            break 2;
                        }
                    }
                }
            }
        }

        $soap = $soapText ? json_decode($soapText, true) : null;

        if (!$soap) {
            http_response_code(500);
            echo json_encode([
                "error" => "Could not parse SOAP JSON",
                "raw" => $resp
            ]);
            exit;
        }

        /* =====================================================
           4) RETURN TO FRONTEND
           ===================================================== */
        echo json_encode([
            "subjective" => $soap["subjective"],
            "objective"  => $soap["objective"],
            "assessment" => $soap["assessment"],
            "plan"       => $soap["plan"]
            // transcript intentionally NOT returned
        ]);
    }
}

?>




