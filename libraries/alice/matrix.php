<?php
/**
 * Matrix helper for WordPress (token stored in wp_options: matrix_token)
 *
 * Usage:
 *   Matrix::sendToUser('@tapuz:matrix.tapuz.be', 'Backup OK ✅');
 *   Matrix::sendToRoom('!hcDPfsoyKzTvPFxcPQ:matrix.tapuz.be', 'Hello room');
 */
class Matrix
{
    private const HOMESERVER = 'https://matrix.tapuz.be';
    private const TOKEN_OPTION = 'matrix_token';

    /**
     * Send a DM-style message to a user. Matrix is room-based, so we:
     *  - look for an existing 1:1 room with that user
     *  - otherwise create a DM room
     *  - then send the message to that room
     */
    public static function sendToUser(string $userId, string $message): bool
    {
        $token = self::getToken();
        if ($token === null) return false;

        // 1) Get joined rooms
        $rooms = self::api('GET', self::HOMESERVER . '/_matrix/client/v3/joined_rooms', null, $token);
        if (!is_array($rooms) || empty($rooms['joined_rooms']) || !is_array($rooms['joined_rooms'])) {
            return false;
        }

        // 2) Find an existing 1:1 room with $userId
        $roomId = null;
        foreach ($rooms['joined_rooms'] as $rid) {
            $members = self::api(
                'GET',
                self::HOMESERVER . '/_matrix/client/v3/rooms/' . rawurlencode($rid) . '/joined_members',
                null,
                $token
            );

            if (!is_array($members) || empty($members['joined']) || !is_array($members['joined'])) {
                continue;
            }

            // Heuristic for DM: exactly 2 joined members, and target user is one of them
            if (count($members['joined']) === 2 && isset($members['joined'][$userId])) {
                $roomId = $rid;
                break;
            }
        }

        // 3) If no room found, create DM room and invite target
        if (!$roomId) {
            $create = self::api('POST', self::HOMESERVER . '/_matrix/client/v3/createRoom', [
                'invite'    => [$userId],
                'is_direct' => true,
                'preset'    => 'trusted_private_chat',
            ], $token);

            if (!is_array($create) || empty($create['room_id'])) {
                return false;
            }
            $roomId = (string)$create['room_id'];
        }

        // 4) Send message
        return self::sendToRoom($roomId, $message);
    }

    /**
     * Send a message to a specific room_id.
     */
    public static function sendToRoom(string $roomId, string $message): bool
    {
        $token = self::getToken();
        if ($token === null) return false;

        $txnId = (string) round(microtime(true) * 1000);

        $url = self::HOMESERVER
            . '/_matrix/client/v3/rooms/' . rawurlencode($roomId)
            . '/send/m.room.message/' . rawurlencode($txnId);

        $res = self::api('PUT', $url, [
            'msgtype' => 'm.text',
            'body'    => $message,
        ], $token);

        return is_array($res) && isset($res['event_id']);
    }

    /**
     * Optional: send HTML formatted message (Element will render it).
     */
    public static function sendHtmlToRoom(string $roomId, string $plainText, string $html): bool
    {
        $token = self::getToken();
        if ($token === null) return false;

        $txnId = (string) round(microtime(true) * 1000);

        $url = self::HOMESERVER
            . '/_matrix/client/v3/rooms/' . rawurlencode($roomId)
            . '/send/m.room.message/' . rawurlencode($txnId);

        $res = self::api('PUT', $url, [
            'msgtype'        => 'm.notice',
            'body'           => $plainText,
            'format'         => 'org.matrix.custom.html',
            'formatted_body' => $html,
        ], $token);

        return is_array($res) && isset($res['event_id']);
    }

    /**
     * Fetch token from WordPress options.
     */
    private static function getToken(): ?string
    {
        if (!function_exists('get_option')) {
            return null;
        }

        $token = get_option(self::TOKEN_OPTION);
        $token = preg_replace('/\s+/', '', trim((string)$token)); // remove hidden spaces/newlines

        // Basic Matrix token sanity check: Synapse user tokens typically start with "syt_"
        // (Don’t over-restrict; just reject empty/obviously wrong)
        if ($token === '' || strlen($token) < 20) {
            return null;
        }
        // If you want strict:
        // if (strpos($token, 'syt_') !== 0) return null;

        return $token;
    }

    /**
     * Low-level Matrix API call using cURL.
     * Returns decoded JSON array on success, null on error.
     */
    private static function api(string $method, string $url, ?array $body, string $token): ?array
    {
        $ch = curl_init($url);

        $headers = [
            'Authorization: Bearer ' . $token,
            'Content-Type: application/json',
        ];

        $opts = [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CUSTOMREQUEST  => $method,
            CURLOPT_HTTPHEADER     => $headers,
            CURLOPT_TIMEOUT        => 8,
        ];

        // Only set POSTFIELDS when we actually have a body (avoid GET-with-body weirdness)
        if ($body !== null) {
            $opts[CURLOPT_POSTFIELDS] = json_encode($body, JSON_UNESCAPED_UNICODE);
        }

        curl_setopt_array($ch, $opts);

        $raw = curl_exec($ch);
        $http = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $err  = curl_error($ch);
        curl_close($ch);

        if ($raw === false || $http < 200 || $http >= 300) {
            // Optional: log for debugging
            // error_log("Matrix API error: $method $url -> HTTP $http; curl=$err; body=" . substr((string)$raw,0,500));
            return null;
        }

        $json = json_decode($raw, true);
        return is_array($json) ? $json : null;
    }
}