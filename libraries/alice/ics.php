<?php
class ICS {

    public static function render($appointment, $clinic) {

        $tz = new DateTimeZone('Europe/Amsterdam');

        // DTSTART/DTEND in local time (NO Z)
        $start = (new DateTime($appointment->start, $tz))->format("Ymd\\THis");
        $end   = (new DateTime($appointment->end,   $tz))->format("Ymd\\THis");

        // DTSTAMP/CREATED/LAST-MODIFIED in UTC (WITH Z)
        $utc     = new DateTimeZone('UTC');
        $dtstamp = (new DateTime('now', $utc))->format("Ymd\\THis\\Z");
        $created = $dtstamp;

        // tel:
        $telDigits = preg_replace('/[^\d+]/', '', (string)$clinic->clinic_tel);
        $telUri    = "tel:" . $telDigits;

        // stable UID (same for same appointment)
        $uid = self::generateUID((string)$appointment->id);

        // description (escape newlines as \n)
        $descLines = [
            "Tijdstip: " . $appointment->time,
            "Bellen: " . $telUri,
            "Afspraak beheren: " . $clinic->clinic_url_booking,
        ];
        $description = implode("\\n", array_filter($descLines));

        $ics  = "BEGIN:VCALENDAR\n";
        $ics .= "PRODID:-//Timegenics//Appointments//NL\n";
        $ics .= "VERSION:2.0\n";
        $ics .= "CALSCALE:GREGORIAN\n";
        $ics .= "METHOD:REQUEST\n";

        $ics .= "BEGIN:VEVENT\n";
        $ics .= "UID:" . $uid . "\n";
        $ics .= "SEQUENCE:" . (int)$appointment->ics_sequence . "\n";
        $ics .= "DTSTAMP:" . $dtstamp . "\n";
        $ics .= "CREATED:" . $created . "\n";
        $ics .= "LAST-MODIFIED:" . $dtstamp . "\n";

        $ics .= "SUMMARY;LANGUAGE=nl-NL:" . $appointment->clinic_name . " " . $appointment->patient_firstname . "\n";
        $ics .= "DESCRIPTION;LANGUAGE=nl-NL:" . $description . "\n";
        $ics .= "LOCATION:" . $appointment->clinic_name . " " . $appointment->clinic_address . "\n";

        $ics .= "DTSTART;TZID=Europe/Amsterdam:" . $start . "\n";
        $ics .= "DTEND;TZID=Europe/Amsterdam:" . $end . "\n";

        // organizer/attendee once
        $ics .= "ORGANIZER;CN=" . $appointment->clinic_name . ":mailto:". $clinic->clinic_email . "\n";
        $ics .= "ATTENDEE;CN=" . $appointment->patient_firstname . ";ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=FALSE:mailto:" . $appointment->patient_email . "\n";
        $ics .= "STATUS:CONFIRMED\n";

        // links
        $ics .= "CONFERENCE:" . $telUri . "\n";
        if (!empty($clinic->clinic_url_booking)) {
            $ics .= "URL:" . $clinic->clinic_url_booking . "\n";
            $ics .= "ATTACH;FMTTYPE=text/html:" . $clinic->clinic_url_booking . "\n";
        }

        // alarms
        $ics .= "BEGIN:VALARM\n";
        $ics .= "TRIGGER:-P7D\n";
        $ics .= "ACTION:DISPLAY\n";
        $ics .= "DESCRIPTION:Reminder (1 week before)\n";
        $ics .= "END:VALARM\n";

        $ics .= "BEGIN:VALARM\n";
        $ics .= "TRIGGER:-P1D\n";
        $ics .= "ACTION:DISPLAY\n";
        $ics .= "DESCRIPTION:Reminder (1 day before)\n";
        $ics .= "END:VALARM\n";

        $ics .= "END:VEVENT\n";

        // timezone block (ok to keep)
        $ics .= "BEGIN:VTIMEZONE\n";
        $ics .= "TZID:Europe/Amsterdam\n";
        $ics .= "BEGIN:DAYLIGHT\n";
        $ics .= "TZOFFSETFROM:+0100\n";
        $ics .= "TZOFFSETTO:+0200\n";
        $ics .= "DTSTART:19810329T020000\n";
        $ics .= "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\n";
        $ics .= "TZNAME:CEST\n";
        $ics .= "END:DAYLIGHT\n";
        $ics .= "BEGIN:STANDARD\n";
        $ics .= "TZOFFSETFROM:+0200\n";
        $ics .= "TZOFFSETTO:+0100\n";
        $ics .= "DTSTART:19961027T030000\n";
        $ics .= "RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\n";
        $ics .= "TZNAME:CET\n";
        $ics .= "END:STANDARD\n";
        $ics .= "END:VTIMEZONE\n";

        $ics .= "END:VCALENDAR\n";

        return $ics;
    }

    private static function generateUID(string $appointmentId): string {
        return hash('sha256', $appointmentId) . '@timegenics.com';
    }
}
?>
