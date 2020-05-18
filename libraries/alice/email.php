<?
include_once(ABSPATH . WPINC . '/class-phpmailer.php'); 
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
    $attachments,
    $ics;
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
        $mail->addStringAttachment($this->ics, 'mijnafspraak.ics');
        //$mail->Body.= 'Nieuwe afsrpaaak bij blablabla';
        //$mail->AltBody = 'This is the body in plain text for non-HTML mail clients';
        if(!$mail->send()) {
            error_log($mail->ErrorInfo);
            return $mail->ErrorInfo;
		} else {
			return true;
		}
        //if(!$mail->send()) {
        //  echo 'Message was not sent.';
        //  echo 'Mailer error: ' . $mail->ErrorInfo;
        //} else {
        //  echo 'Message has been sent.';
        //}
        
        
        
    }
    
    
    
}
?>


