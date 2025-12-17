<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

include_once(ABSPATH . WPINC . '/PHPMailer/PHPMailer.php');
include_once(ABSPATH . WPINC . '/PHPMailer/SMTP.php');
include_once(ABSPATH . WPINC . '/PHPMailer/Exception.php');

//include_once('/var/www/timegenics_dev/public_html/wp-includes/PHPMailer/PHPMailer.php');
//include_once('/var/www/timegenics_dev/public_html/wp-includes/PHPMailer/SMTP.php');
//include_once('/var/www/timegenics_dev/public_html/wp-includes/PHPMailer/Exception.php');



class Email {
    var
    $smtp_server,
    $smtp_port,
	$smtp_username,
	$smtp_password,
    $smtp_encryption,
	$to,
    $from_name,
    $from_email,
    $headers,
    $subject,
    $message,
    $attachment,
    $ics,
    $clinic;
    
    function __construct()
   {
         
   }
    
    public function send(){

        $mail = new PHPMailer(true);

        $mail->isSMTP();
        $mail->Host       = $this->smtp_server;
        $mail->SMTPAuth   = true;
        $mail->Username   = $this->smtp_username;
        $mail->Password   = $this->smtp_password;
        $mail->SMTPSecure = $this->smtp_encryption;
        $mail->Port       = $this->smtp_port;

        $mail->CharSet = 'UTF-8';
        $mail->isHTML(true);

        $mail->addReplyTo($this->from_email, $this->from_name);
        $mail->setFrom(NOREPLY_EMAIL, $this->from_name);
        $mail->addAddress($this->to);

        $mail->Subject = $this->subject;
        $mail->Body    = $this->message;

        // Message-ID
        $parts  = explode("@", $this->from_email);
        $domain = $parts[1] ?? 'timegenics.com';
        $mail->MessageID = "<" . md5('HELLO'.(idate("U")-1000000000).uniqid()) . '@' . $domain . '>';

        // Attachment handling
        if (!empty($this->attachment['file']) && !empty($this->attachment['filename'])) {

            $filename = $this->attachment['filename'];
            $content  = $this->attachment['file'];
            $ext      = strtolower(pathinfo($filename, PATHINFO_EXTENSION));

            if ($ext === 'ics') {
                // Critical for iPhone/Apple Mail: add a calendar MIME part
                $mail->Ical = $content;

                // Also attach as file (optional, but nice)
                $mail->addStringAttachment(
                    $content,
                    $filename,
                    'base64',
                    'text/calendar; method=REQUEST; charset=UTF-8'
                );

                // Helps Outlook/Apple sometimes
                $mail->addCustomHeader('Content-class: urn:content-classes:calendarmessage');

            } elseif ($ext === 'pdf') {
                $mail->addStringAttachment($content, $filename, 'base64', 'application/pdf');
            } else {
                // fallback
                $mail->addStringAttachment($content, $filename);
            }
        }

        try {
            if (!$mail->send()) {
                error_log($mail->ErrorInfo);
                return $mail->ErrorInfo;
            }
            return 200;
        } catch (\Exception $e) {
            error_log($mail->ErrorInfo);
            return $mail->ErrorInfo ?: $e->getMessage();
        }
    }


    public function getServerSettings($clinic){
        loadLib('clinic'); 
        error_log('this is the clinic : ' . $clinic);
        $clinic = Clinic::getClinic($clinic);
        $this->smtp_server = $clinic->smtp_server;
        $this->smtp_port = $clinic->smtp_port; //
        $this->smtp_username = $clinic->smtp_username;
        $this->smtp_password = $clinic->smtp_password;
        $this->smtp_encryption = $clinic->smtp_encryption;
        
        $this->from_email = $clinic->clinic_email;
        $this->from_name = $clinic->email_name;

    }

    public function sendAppointmentEmail($appointment,$mode){
        
        loadLib('ics');//generate ICS file
        loadLib('clinic');    
                
                $clinic = Clinic::getClinic($appointment->clinic);
                $this->getServerSettings($appointment->clinic);
                
                //add clinic name to $appointment object
                $appointment->{"clinic_name"} = $clinic->clinic_name;
                $appointment->{"clinic_address"} = $clinic->clinic_street . " - " . $clinic->clinic_postcode . " " . $clinic->clinic_city;  
                $appointment->{"time"} = strftime('%e %B %Y om %H:%M',strtotime($appointment->start)); //set accorde to locale set in configuration.php
                
                $this->to = $appointment->email;
            
                
                
               
    
                switch ($mode){
                    case "confirmation":
                        $message = file_get_contents('assets/email_templates/appointmentConfirmation.html');

                        $message = str_replace('%patient%', $appointment->patient_firstname, $message);
                        $message = str_replace('%time%', $appointment->time, $message);
                        $message = str_replace('%address%', $appointment->clinic_name . " - "  . $appointment->clinic_address, $message);
                        $message = str_replace('%practitioner%', $appointment->resourceName, $message);
                        $this->subject = $clinic->email_appointment_confirmation_subject;
                        $message = str_replace('%title%', $clinic->email_appointment_confirmation_subject, $message);
                        $message = str_replace('%text1%', $clinic->email_appointment_confirmation_text1, $message);
                        $message = str_replace('%text2%', $clinic->email_appointment_confirmation_text2, $message);
                        $message = str_replace('%url_booking%', $clinic->clinic_url_booking, $message);
                    break;
                    case "amended":
                        $message = file_get_contents('assets/email_templates/appointmentConfirmation.html');

                        $message = str_replace('%patient%', $appointment->patient_firstname, $message);
                        $message = str_replace('%time%', $appointment->time, $message);
                        $message = str_replace('%address%', $appointment->clinic_name . " - "  . $appointment->clinic_address, $message);
                        $message = str_replace('%practitioner%', $appointment->resourceName, $message);
                        $this->subject = $clinic->email_appointment_amended_subject;
                        $message = str_replace('%title%', $clinic->email_appointment_amended_subject, $message);
                        $message = str_replace('%text1%', $clinic->email_appointment_amended_text, $message);
                        $message = str_replace('%text2%', '', $message);
                        $message = str_replace('%url_booking%', $clinic->clinic_url_booking, $message);
                   

                    break;
                    case "addedToWaitinglist":
                        $message = file_get_contents('assets/email_templates/addedToWaitinglist.html');

                        $message = str_replace('%patient%', $appointment->patient_firstname, $message);
                        $message = str_replace('%service%', $appointment->description, $message);
                        $message = str_replace('%clinic%', $appointment->clinic_name . " - "  . $appointment->clinic_address, $message);
                        $message = str_replace('%practitioner%', $appointment->resourceName, $message);
                        $this->subject = $clinic->email_waitinglist_subject. ' ' . $appointment->description ;
                        $message = str_replace('%text1%', $clinic->email_waitinglist_text, $message);
                        $message = str_replace('%note%', $appointment->note, $message);
                   

                    break;
                
                }
                
                $this->message = $message;
                $this->attachment['file'] = ICS::render($appointment,$clinic);
                $this->attachment['filename']='mijnafspraak.ics';
                
                $this->send();
    }

    public function sendOnlineBookingReport($appointment){
        loadLib('clinic');    
        loadLib('service');
        //get the service name
		$this->getServerSettings($appointment->clinic);
        $service = Service::getService($appointment->serviceId);
        $clinic = Clinic::getClinic($appointment->clinic);
        
                
                //add clinic name to $appointment object
        $appointment->{"clinic_name"} = $clinic->clinic_name;
        $appointment->{"clinic_address"} = $clinic->clinic_street . " - " . $clinic->clinic_postcode . " " . $clinic->clinic_city;  
        $appointment->{"time"} = strftime('%e %B %Y om %H:%M',strtotime($appointment->start)); //set accorde to locale set in configuration.php
                
        $this->to = $clinic->clinic_email;
    
                
        $message = file_get_contents('assets/email_templates/newOnlineBookingReport.html');
        $message = str_replace('%patient%', $appointment->patientName , $message);
        $message = str_replace('%time%', $appointment->time, $message);
        $message = str_replace('%clinic%', $appointment->clinic_name, $message);
        $message = str_replace('%service%', $service->description, $message);
        $message = str_replace('%practitioner%', $appointment->resourceName, $message);
        
        $this->subject = 'New online booking';              
        $this->message = $message;
        $this->send();
    }
    
    
    
    
}
?>

