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
                "subjective" => [
                    "type" => "string",
                    "description" => "Subjectieve klachten en beleving van de patiënt (Nederlands, bij voorkeur Belgisch Nederlands)."
                ],
                "objective"  => [
                    "type" => "string",
                    "description" => "Objectieve bevindingen/observaties/metingen (Nederlands)."
                ],
                "assessment" => [
                    "type" => "string",
                    "description" => "Beoordeling/diagnostische inschatting (Nederlands)."
                ],
                "plan"       => [
                    "type" => "string",
                    "description" => "Behandelplan/advies/beleid (Nederlands)."
                ]
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
                "FOLLOW-UP (SOAP ONLY).\n" .
                "Geef ALLE output uitsluitend in het Nederlands (bij voorkeur Belgisch Nederlands). Gebruik nooit Engels.\n" .
                "Als het transcript Engelse woorden/termen bevat, vertaal die naar correct Nederlands.\n" .
                "Extraheer UITSLUITEND een SOAP-notitie uit dit transcript.\n" .
                "Extraheer GEEN complaint/PMH/family/social/orthotics.\n" .
                "Gebruik alleen informatie die expliciet in het transcript staat. Niet gokken.\n\n" .
                $transcript;

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
                            "chief_complaint" => [
                                "type" => ["string","null"],
                                "description" => "Hoofdklacht in het Nederlands."
                            ],
                            "associated_complaints" => [
                                "type" => "array",
                                "items" => ["type" => "string"],
                                "description" => "Bijkomende klachten (Nederlands)."
                            ],
                            "location" => [
                                "type" => ["string","null"],
                                "description" => "Lokalisatie van de klacht (Nederlands)."
                            ],
                            "onset" => [
                                "type" => ["string","null"],
                                "description" => "Ontstaan/begin (Nederlands)."
                            ],
                            "duration" => [
                                "type" => ["string","null"],
                                "description" => "Duur (Nederlands)."
                            ],
                            "timing" => [
                                "type" => ["string","null"],
                                "description" => "Tijdsverloop/variatie (Nederlands)."
                            ],
                            "intensity" => [
                                "type" => ["string","null"],
                                "description" => "Intensiteit, bv. '7/10' (Nederlands notatie ok)."
                            ],
                            "character" => [
                                "type" => ["string","null"],
                                "description" => "Karakter van de pijn/klacht (Nederlands)."
                            ],
                            "aggravating_factors" => [
                                "type" => "array",
                                "items" => ["type" => "string"],
                                "description" => "Uitlokkende/verergerende factoren (Nederlands)."
                            ],
                            "relieving_factors" => [
                                "type" => "array",
                                "items" => ["type" => "string"],
                                "description" => "Verlichtende factoren (Nederlands)."
                            ],
                            "previous_treatments" => [
                                "type" => ["string","null"],
                                "description" => "Eerdere behandelingen/medicatie/maatregelen (Nederlands)."
                            ],
                            "note" => [
                                "type" => ["string","null"],
                                "description" => "Extra notities (Nederlands)."
                            ]
                        ],
                        "required" => [
                            "chief_complaint","associated_complaints","location","onset","duration","timing",
                            "intensity","character","aggravating_factors","relieving_factors","previous_treatments","note"
                        ]
                    ],

                    "pmh" => [
                        "type" => "array",
                        "description" => "Persoonlijke medische voorgeschiedenis (Nederlands).",
                        "items" => [
                            "type" => "object",
                            "additionalProperties" => false,
                            "properties" => [
                                "year" => [
                                    "type" => ["integer","null"],
                                    "description" => "Jaar (indien genoemd)."
                                ],
                                "condition" => [
                                    "type" => "string",
                                    "description" => "Aandoening/ingreep (Nederlands)."
                                ]
                            ],
                            "required" => ["year","condition"]
                        ]
                    ],

                    "family_history" => [
                        "type" => "array",
                        "description" => "Familiale voorgeschiedenis (Nederlands).",
                        "items" => [
                            "type" => "object",
                            "additionalProperties" => false,
                            "properties" => [
                                "condition" => [
                                    "type" => "string",
                                    "description" => "Aandoening (Nederlands)."
                                ],
                                "relationship" => [
                                    "type" => "string",
                                    "description" => "Familierelatie (bv. vader, moeder) in het Nederlands."
                                ]
                            ],
                            "required" => ["condition","relationship"]
                        ]
                    ],

                    "social" => [
                        "type" => "object",
                        "additionalProperties" => false,
                        "properties" => [
                            "profession" => [
                                "type" => ["string","null"],
                                "description" => "Beroep (Nederlands)."
                            ],
                            "retired" => [
                                "type" => ["boolean","null"],
                                "description" => "Gepensioneerd (true/false) enkel indien expliciet genoemd."
                            ],
                            "smoking" => [
                                "type" => ["string","null"],
                                "description" => "Roken (Nederlands, bv. 'niet-roker', '10 sigaretten/dag')."
                            ],
                            "drinking" => [
                                "type" => ["string","null"],
                                "description" => "Alcohol (Nederlands)."
                            ],
                            "sport" => [
                                "type" => ["string","null"],
                                "description" => "Sport/activiteit (Nederlands)."
                            ],
                            "sleeping" => [
                                "type" => ["string","null"],
                                "description" => "Slaap (Nederlands)."
                            ]
                        ],
                        "required" => ["profession","retired","smoking","drinking","sport","sleeping"]
                    ],

                    "orthotics" => [
                        "type" => ["object","null"],
                        "additionalProperties" => false,
                        "properties" => [
                            "uses_orthotics" => [
                                "type" => ["boolean","null"],
                                "description" => "Gebruikt steunzolen/orthesen: true/false enkel indien expliciet vermeld."
                            ],
                            "type" => [
                                "type" => ["string","null"],
                                "description" => "Type steunzolen/orthesen (Nederlands)."
                            ],
                            "origin" => [
                                "type" => ["string","null"],
                                "description" => "Herkomst/oorsprong (bv. podoloog, orthopedist, winkel) in het Nederlands."
                            ],
                            "since" => [
                                "type" => ["string","null"],
                                "description" => "Sinds wanneer (Nederlands)."
                            ],
                            "effect" => [
                                "type" => ["string","null"],
                                "description" => "Effect/ervaring (Nederlands)."
                            ],
                            "notes" => [
                                "type" => ["string","null"],
                                "description" => "Extra notities (Nederlands)."
                            ],
                            "heel_lift" => [
                                "type" => ["string","null"],
                                "description" => "Hakverhoging (Nederlands), indien vermeld."
                            ]
                        ],
                        "required" => ["uses_orthotics","type","origin","since","effect","notes","heel_lift"]
                    ],
                ],
                "required" => ["soap","complaint","pmh","family_history","social","orthotics"]
            ];

            $userPrompt =
                "VOLLEDIGE INTAKE.\n" .
                "Geef ALLE output uitsluitend in het Nederlands (bij voorkeur Belgisch Nederlands). Gebruik nooit Engels.\n" .
                "Als het transcript Engelse woorden/termen bevat, vertaal die naar correct Nederlands.\n" .
                "Extraheer een SOAP-notitie én gestructureerde intakevelden uit dit transcript.\n" .
                "Extraheer ook steunzolen/orthesen (orthotics/insoles) en hakverhoging (heel lift/hakverhoging) indien expliciet vermeld.\n" .
                "Gebruik alleen informatie die expliciet in het transcript staat. Niet gokken. Indien niet vermeld: null/lege array/string.\n\n" .
                $transcript;
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
                        "Je bent een klinisch verslaggever voor een Nederlandstalige praktijk. " .
                        "ALLE output MOET in het Nederlands zijn (bij voorkeur Belgisch Nederlands). Gebruik nooit Engels. " .
                        "Als het transcript Engelse termen bevat, vertaal ze naar correct Nederlands. " .
                        "Gebruik alleen informatie die expliciet in het transcript staat. Niet gokken. Niet verzinnen. " .
                        "Als een veld niet genoemd wordt: geef null of een lege array/string, passend bij het schema."
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