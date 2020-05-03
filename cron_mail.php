<?php
include('configuration.php');

require_once ($config['path_wp-config']);

define('ROOT',						dirname(__FILE__));



//check debug mode

if ($config['debug_mode'] === true)
	{
		error_reporting(E_ALL);
        ini_set('display_errors', 'off');
        ini_set('log_errors', 'on');
        ini_set('error_log', 'error.log');
	}
include('libraries/alice/alice.php');
loadLib('email');
loadLib('clinic');
loadLib('ics');
error_log('CRON JOB STARTED');

echo "GETTING READY<BR>";
//get all the appts

global $wpdb;
$query = "SELECT * from view_appointments WHERE (customAppointment = 0 AND DATE_FORMAT (start , '%Y-%m-%d' ) = CURDATE( ) + interval 1 day)";
//$query = "SELECT * from view_appointments WHERE (customAppointment = 0 AND DATE_FORMAT (start , '%Y-%m-%d' ) = CURDATE())";
$appointments = $wpdb->get_results($query);

foreach ($appointments as $appointment) {
    $clinic = Clinic::getClinic($appointment->clinic);
			
			//add clinic name to $appointment object
			$appointment->{"clinic_name"} = $clinic->clinic_name;
			$appointment->{"clinic_address"} = $clinic->clinic_street . " - " . $clinic->clinic_postcode . " " . $clinic->clinic_city;  
			$appointment->{"time"} = strftime('%e/%m/%Y om %H:%M',strtotime($appointment->start)); //set accorde to locale set in configuration.php
			
			$email = new Email();
			
			$email->smtp_server = $clinic->smtp_server;
			$email->smtp_port = $clinic->smtp_port; //
			$email->smtp_username = $clinic->smtp_username;
			$email->smtp_password = $clinic->smtp_password;
			
			$email->to = $appointment->email;
			$email->from_email = $clinic->clinic_email;
			$email->from_name = $clinic->email_name;
			$email->subject = 'Een herinnering van je afspraak op ' . $appointment->time;
			
			
			$message = file_get_contents('assets/email_templates/appointmentReminder.html');
			$message = str_replace('%clinic%', $appointment->clinic_name, $message);
			$message = str_replace('%title%', 'Herinnering van je afspraak',$message);
			$message = str_replace('%text%', $clinic->email_appointment_confirmation_text, $message);
			$message = str_replace('%patient%', $appointment->patient_firstname, $message);
			$message = str_replace('%time%', $appointment->time, $message);
			$message = str_replace('%address%', $appointment->clinic_name . " - "  . $appointment->clinic_address, $message);
			$message = str_replace('%practitioner%', $appointment->resourceName, $message);
			
			$email->message = $message;
			$email->ics = ICS::render($appointment);

			echo '<br> Sending mail to ' . $appointment->patientName . ' --> ' .$appointment->email;
			

			if($email->send($error)){
				echo ' [DONE]' ;
			}else{
				echo ' [ERROR]- ' . $error;
			}



}
		







?>