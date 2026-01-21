<?php

class Ai {

    public static function processEncounterRecording($tmpPath, $origName, $soapOnly = false) {

        // ✅ NEVER hardcode API keys
        $apiKey = get_option('openai_api_key');
        $apiKey = trim((string)$apiKey);
        $apiKey = preg_replace('/\s+/', '', $apiKey);

        if (!$apiKey || strpos($apiKey, 'sk-') !== 0) {
            http_response_code(500);
            echo json_encode(["error" => "OPENAI_API_KEY missing/invalid"]);
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
        $curlErrNo = curl_errno($ch);
        $curlErr   = curl_error($ch);
        curl_close($ch);

        if ($transcribeRaw === false || $code >= 300) {
            http_response_code(500);
            echo json_encode([
                "error"   => "Transcription failed",
                "http"    => $code,
                "curl_no" => $curlErrNo,
                "curl"    => $curlErr,
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
           2) BUILD JSON SCHEMA (SOAP-only vs Full)
           ===================================================== */

        $soapSchema = [
            "type" => "object",
            "additionalProperties" => false,
            "properties" => [
                "subjective" => ["type" => "string"],
                "objective"  => ["type" => "string"],
                "assessment" => ["type" => "string"],
                "plan"       => ["type" => "string"]
            ],
            "required" => ["subjective","objective","assessment","plan"]
        ];

        if ($soapOnly) {
            $schema = [
                "type" => "object",
                "additionalProperties" => false,
                "properties" => [
                    "soap" => $soapSchema
                ],
                "required" => ["soap"]
            ];

            $userPrompt =
                "Extract ONLY a Dutch SOAP note from this transcript (follow-up visit). " .
                "Do NOT extract complaint/PMH/family/social/orthotics. " .
                "Only use information explicitly present.\n\n" . $transcript;

        } else {
            $schema = [
                "type" => "object",
                "additionalProperties" => false,
                "properties" => [
                    "soap" => $soapSchema,

                    "complaint" => [
                        "type" => ["object","null"],
                        "additionalProperties" => false,
                        "properties" => [
                            "chief_complaint"       => ["type" => ["string","null"]],
                            "associated_complaints" => ["type" => "array", "items" => ["type" => "string"]],
                            "location"              => ["type" => ["string","null"]],
                            "onset"                 => ["type" => ["string","null"]],
                            "duration"              => ["type" => ["string","null"]],
                            "timing"                => ["type" => ["string","null"]],
                            "intensity"             => ["type" => ["string","null"]],
                            "character"             => ["type" => ["string","null"]],
                            "aggravating_factors"   => ["type" => "array", "items" => ["type" => "string"]],
                            "relieving_factors"     => ["type" => "array", "items" => ["type" => "string"]],
                            "previous_treatments"   => ["type" => ["string","null"]],
                            "note"                  => ["type" => ["string","null"]]
                        ],
                        "required" => [
                            "chief_complaint","associated_complaints","location","onset","duration","timing",
                            "intensity","character","aggravating_factors","relieving_factors","previous_treatments","note"
                        ]
                    ],

                    "pmh" => [
                        "type" => "array",
                        "items" => [
                            "type" => "object",
                            "additionalProperties" => false,
                            "properties" => [
                                "year" => ["type" => ["integer","null"]],
                                "condition" => ["type" => "string"]
                            ],
                            "required" => ["year","condition"]
                        ]
                    ],

                    "family_history" => [
                        "type" => "array",
                        "items" => [
                            "type" => "object",
                            "additionalProperties" => false,
                            "properties" => [
                                "condition" => ["type" => "string"],
                                "relationship" => ["type" => "string"]
                            ],
                            "required" => ["condition","relationship"]
                        ]
                    ],

                    "social" => [
                        "type" => "object",
                        "additionalProperties" => false,
                        "properties" => [
                            "profession" => ["type" => ["string","null"]],
                            "retired"    => ["type" => ["string","null"]],
                            "smoking"    => ["type" => ["string","null"]],
                            "drinking"   => ["type" => ["string","null"]],
                            "sport"      => ["type" => ["string","null"]],
                            "sleeping"   => ["type" => ["string","null"]]
                        ],
                        "required" => ["profession","retired","smoking","drinking","sport","sleeping"]
                    ],

                    "orthotics" => [
                        "type" => ["object","null"],
                        "additionalProperties" => false,
                        "properties" => [
                            "uses_orthotics" => ["type" => ["boolean","null"]],
                            "type"           => ["type" => ["string","null"]],
                            "origin"         => ["type" => ["string","null"]],
                            "since"          => ["type" => ["string","null"]],
                            "effect"         => ["type" => ["string","null"]],
                            "notes"          => ["type" => ["string","null"]],
                            "heel_lift"      => ["type" => ["string","null"]]
                        ],
                        "required" => ["uses_orthotics","type","origin","since","effect","notes","heel_lift"]
                    ],
                ],
                "required" => ["soap","complaint","pmh","family_history","social","orthotics"]
            ];

            $userPrompt =
                "Extract a Dutch SOAP note AND structured intake fields from this transcript. " .
                "Also extract orthotics/insole (steunzolen) and heel lift (hakverhoging) if explicitly mentioned. " .
                "Only use information explicitly present. If not mentioned, return null/empty.\n\n" . $transcript;
        }

        /* =====================================================
           3) GENERATE STRUCTURED OUTPUT (RESPONSES API)
           ===================================================== */
        $payload = [
            "model" => "gpt-4o",
            "input" => [
                [
                    "role" => "system",
                    "content" =>
                        "You are a clinical scribe. Return ONLY information explicitly present in the transcript. " .
                        "If a field is not mentioned, return null or an empty array/string as appropriate. " .
                        "Do not guess. Do not invent."
                ],
                [
                    "role" => "user",
                    "content" => $userPrompt
                ]
            ],
            "text" => [
                "format" => [
                    "type"   => "json_schema",
                    "name"   => $soapOnly ? "encounter_soap_only" : "encounter_extract",
                    "strict" => true,
                    "schema" => $schema
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
        $curlErrNo = curl_errno($ch);
        $curlErr   = curl_error($ch);
        curl_close($ch);

        if ($respRaw === false || $code >= 300) {
            http_response_code(500);
            echo json_encode([
                "error"   => "Structured extraction failed",
                "http"    => $code,
                "curl_no" => $curlErrNo,
                "curl"    => $curlErr,
                "details" => $respRaw
            ]);
            exit;
        }

        $resp = json_decode($respRaw, true);

        /* =====================================================
           4) EXTRACT STRUCTURED JSON FROM RESPONSE
           ===================================================== */
        $jsonText = null;

        if (isset($resp["output"]) && is_array($resp["output"])) {
            foreach ($resp["output"] as $o) {
                if (($o["type"] ?? "") === "message") {
                    foreach (($o["content"] ?? []) as $c) {
                        if (($c["type"] ?? "") === "output_text") {
                            $jsonText = $c["text"] ?? null;
                            break 2;
                        }
                    }
                }
            }
        }

        $out = $jsonText ? json_decode($jsonText, true) : null;

        if (!$out || !isset($out["soap"])) {
            http_response_code(500);
            echo json_encode([
                "error" => "Could not parse structured JSON",
                "raw" => $resp
            ]);
            exit;
        }

        /* =====================================================
           5) RETURN TO FRONTEND
           ===================================================== */
        if ($soapOnly) {
            echo json_encode([
                "soap" => $out["soap"]
            ]);
            exit;
        }

        echo json_encode([
            "soap" => $out["soap"],
            "complaint" => $out["complaint"],
            "pmh" => $out["pmh"],
            "family_history" => $out["family_history"],
            "social" => $out["social"],
            "orthotics" => $out["orthotics"]
        ]);
        exit;
    }
}
?>