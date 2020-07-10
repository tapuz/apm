<?php
class ICS {
    
    
    public function render($appointment){
        
        $created = self::formatDate(new DateTime());
        $start = self::formatDate(new DateTime($appointment->start));
        $end = self::formatDate(new DateTime($appointment->end));
        
        $ics =  "BEGIN:VCALENDAR\n";
        $ics .=  "PRODID:". $appointment->clinic_name ."\n";
        $ics .=  "VERSION:2.0\n";
        $ics .=  "METHOD:PUBLISH\n";
        $ics .=  "X-MS-OLK-FORCEINSPECTOROPEN:TRUE\n";
        $ics .=  "BEGIN:VEVENT\n";
        $ics .=  "CLASS:PUBLIC\n";
        $ics .=  "CREATED:" . $created . "\n";
        $ics .=  "DESCRIPTION;LANGUAGE=nl-NL:Tijdstip: " . $appointment->time ."\nTot dan!\n\nP.S.: Gebruik je GMAIL? Controleer of uw tijdzone goed staat ingesteld in GMAIL. De hierboven genoemde tijd is de juiste. 003292212766\n";
        $ics .=  "CONFERENCE:tel://003292212766\n";
        $ics .=  "DTSTAMP;TZID=Europe/Amsterdam:". $created ."\n";
        $ics .=  "DTSTART;TZID=Europe/Amsterdam:". $start. "\n";
        $ics .=  "DTEND;TZID=Europe/Amsterdam:". $end ."\n";
        $ics .=  "LAST-MODIFIED:".$created ."\n";
        $ics .=  "LOCATION:". $appointment->clinic_name . " ".$appointment->clinic_address."\n";
        $ics .=  "PRIORITY:5\n";
        $ics .=  "SEQUENCE:0\n";
        $ics .=  "SUMMARY;LANGUAGE=nl-NL:Afspraak ".$appointment->patient_firstname . " " . $appointment->clinic_name ."\n";
        $ics .=  "TRANSP:OPAQUE\n";
        $ics .=  "UID:".$appointment->id."\n";
        $ics .=  "X-MICROSOFT-CDO-BUSYSTATUS:BUSY\n";
        $ics .=  "X-MICROSOFT-CDO-IMPORTANCE:1\n";
        $ics .=  "X-MICROSOFT-DISALLOW-COUNTER:FALSE\n";
        $ics .=  "X-MS-OLK-ALLOWEXTERNCHECK:TRUE\n";
        $ics .=  "X-MS-OLK-AUTOFILLLOCATION:FALSE\n";
        $ics .=  "X-MS-OLK-CONFTYPE:0\n";
        //Here is to set the reminder for the event.
        $ics .=  "BEGIN:VALARM\n";
        $ics .=  "TRIGGER:-PT1440M\n";
        $ics .=  "ACTION:DISPLAY\n";
        $ics .=  "DESCRIPTION:Reminder\n";
        $ics .=  "END:VALARM\n";
        $ics .=  "END:VEVENT\n";
        $ics .=  "BEGIN:VTIMEZONE\n";   
        $ics .=  "TZID:Europe/Amsterdam\n";
        $ics .=  "BEGIN:DAYLIGHT\n";
        $ics .=  "TZOFFSETFROM:+0100\n";
        $ics .=  "TZOFFSETTO:+0200\n";
        $ics .=  "DTSTART:19810329T020000\n";
        $ics .=  "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\n";
        $ics .=  "TZNAME:CEST\n";
        $ics .=  "END:DAYLIGHT\n";
        $ics .=  "BEGIN:STANDARD\n";
        $ics .=  "TZOFFSETFROM:+0200\n";
        $ics .=  "TZOFFSETTO:+0100\n";
        $ics .=  "DTSTART:19961027T030000\n";
        $ics .=  "RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\n";
        $ics .=  "TZNAME:CET\n";
        $ics .=  "END:STANDARD\n";
        $ics .=  "END:VTIMEZONE\n";
        $ics .=  "END:VCALENDAR\n";

        
        
        
        //define('UPLOAD_DIR', 'userdata/ics/');
        //$filename = $appointment->patientID .'_' . $start . '.ics';
		//$savePath = UPLOAD_DIR . $filename;
    
      
        // Write the contents to ics file and return filepath
        //file_put_contents($savePath, $ics);
        
        //return $savePath;
        return $ics;
        
    }
   
    private function formatDate($date) {   
        return $date->format("Ymd\THis\Z");
    }


}



?>



