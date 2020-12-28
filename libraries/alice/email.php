<?
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

include_once(ABSPATH . WPINC . '/PHPMailer/PHPMailer.php');
include_once(ABSPATH . WPINC . '/PHPMailer/SMTP.php');
include_once(ABSPATH . WPINC . '/PHPMailer/Exception.php');

class Email {
    var
    $smtp_server,
    $smtp_port,
	$smtp_username,
	$smtp_password,
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
        
        $mail = new PHPMailer;
        $mail->isSMTP();                                      // Set mailer to use SMTP
        $mail->Host = $this->smtp_server;  // Specify main and backup SMTP servers
        $mail->SMTPAuth = true;                               // Enable SMTP authentication
        $mail->Username = $this->smtp_username;           // SMTP username
        $mail->Password = $this->smtp_password;               // SMTP password
        $mail->SMTPSecure = 'ssl';    // Enable TLS encryption, `ssl` also accepted
        $mail->Port = $this->smtp_port;
        $mail->isHTML(true);    //
        $mail->setFrom($this->from_email, $this->from_name);
        $mail->addAddress($this->to);
        $mail->Subject = $this->subject;
        $mail->Body = $this->message;
        $mail->addStringAttachment($this->attachment['file'], $this->attachment['filename']);
        
        //$mail->addStringAttachment($this->attachment['file'], $this->attachment['filename'],'base64','application/pdf');
        if(!$mail->send()) {
            error_log($mail->ErrorInfo);
            return $mail->ErrorInfo;
		} else {
			return true;
		}
        
        
        
    }

    public function getServerSettings($clinic){
        loadLib('clinic'); 
        $clinic = Clinic::getClinic($clinic);
        $this->smtp_server = $clinic->smtp_server;
        $this->smtp_port = $clinic->smtp_port; //
        $this->smtp_username = $clinic->smtp_username;
        $this->smtp_password = $clinic->smtp_password;
        
        $this->from_email = $clinic->clinic_email;
        $this->from_name = $clinic->email_name;

    }

    function sendAppointmentEmail($appointment,$mode){
        
        loadLib('ics');//generate ICS file
        loadLib('clinic');    
                
                $clinic = Clinic::getClinic($appointment->clinic);
                $this->getServerSettings($appointment->clinic);
                
                //add clinic name to $appointment object
                $appointment->{"clinic_name"} = $clinic->clinic_name;
                $appointment->{"clinic_address"} = $clinic->clinic_street . " - " . $clinic->clinic_postcode . " " . $clinic->clinic_city;  
                $appointment->{"time"} = strftime('%e %B %Y om %H:%M',strtotime($appointment->start)); //set accorde to locale set in configuration.php
                
                $this->to = $appointment->email;
            
                $message = file_get_contents('assets/email_templates/appointmentConfirmation.html');
                
                $message = str_replace('%patient%', $appointment->patient_firstname, $message);
                $message = str_replace('%time%', $appointment->time, $message);
                $message = str_replace('%address%', $appointment->clinic_name . " - "  . $appointment->clinic_address, $message);
                $message = str_replace('%practitioner%', $appointment->resourceName, $message);
    
                switch ($mode){
                    case "confirmation":
                        $this->subject = $clinic->email_appointment_confirmation_subject;
                        $message = str_replace('%title%', $clinic->email_appointment_confirmation_subject, $message);
                        $message = str_replace('%text1%', $clinic->email_appointment_confirmation_text1, $message);
                        $message = str_replace('%text2%', $clinic->email_appointment_confirmation_text2, $message);
                    break;
                    case "amended":
                        $this->subject = $clinic->email_appointment_amended_subject;
                        $message = str_replace('%text1%', $clinic->email_appointment_amended_text, $message);
                    break;
                
                }
                
                $this->message = $message;
                $this->attachment['file'] = ICS::render($appointment,$clinic);
                $this->attachment['filename']='mijnafspraak.ics';
                
                $this->send();
    }
    
    
    
}
?>


