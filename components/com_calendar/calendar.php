<?php 
//APM Component Calendar


define('COMPONENT','calendar');
define('TEMPLATES', ROOT . '/components/com_' . COMPONENT . '/templates/');


loadLib('clinic');
loadLib('patient');
loadLib('calendar');
loadLib('clinic');
loadLib('service');
loadLib('users');


loadCSS('fullcalendar.min.css');
loadCSS('scheduler.min.css');
//loadCSS('fullcalendar.print.css');
loadCSS('calendar.css','calendar');

loadJS('fullcalendar.min.js');
loadJS('gcal.js');
loadJS('scheduler.min.js');
loadJS('typeahead.min.js');
loadJS('appointment.js','calendar');
loadJS('patient.js','patient');
loadJS('calendar.js','calendar');
loadJS('editEvent.js','calendar');
loadJS('eventDetails.js','calendar');
loadJS('cast.js','calendar');
loadJS('clinic.js','calendar');
loadJS('editPatient.js','calendar');
loadJS('email.js','calendar');
loadJS('emailModal.js','calendar');
loadJS('payment.js','calendar');
loadJS('rightPanel.js','calendar');
loadJS('mustache.min.js');
loadJS('socket.io.min.js');
loadExtJS('https://cdn.jsdelivr.net/npm/jquery-validation@1.19.3/dist/jquery.validate.min.js');

//loadJS('jquery.balloon.min.js');


switch (getVar('task')){
	
	case 'searchPatients':
		$name = getVar('name');
		$user = get_current_user_id();
		echo json_encode(Patient::searchPatients($name,$user));
		//echo Patient::searchPatients($name,$user);
	break;
	
	case 'get_data':
		$appointments = Calendar::getAppointments(getVar('user_id'),getVar('start'),getVar('end'));
		echo json_encode($appointments);
	break;
	   
	case 'getUsers':
		
	
	
		$users = Users::getAllPractitioners();
		echo json_encode($users);
		//error_log(json_encode($users));

		
		
	break;
	
	case 'getClinics':
		 $user = get_current_user_id();
		 echo $clinics = json_encode(Clinic::getClinics($user));
	   
	break;

	case 'getWorkingPlan':
		echo $workingPlan = get_user_meta( getVar('userID'), 'working_plan',1);

	break;

	case 'addCustomAppointment':
		$customAppointment =  Calendar::addCustomAppointment(json_decode(stripslashes(getVar('appointment'))));
		echo json_encode($customAppointment);
	break;
	
	case 'addAppointment':
		
		loadLib('email');
		loadLib('ics');//generate ICS file
		
		$appointment =  Calendar::addAppointment(json_decode(stripslashes(getVar('appointment'))));
		
		echo json_encode($appointment);
		
		error_log(json_encode($appointment));
		//send confirmation email only if not a custom appointment or pencilled in
		if ($appointment->status == 0 ){ 
			$email = new Email();
			$email->sendAppointmentEmail($appointment,'confirmation');
		
		}	
	
	break;

	case 'updateCustomAppointment':
		Calendar::updateCustomAppointment(stripslashes(getVar('appointment')));
	break;

	case 'updateAppointment':
		loadLib('email');
		$appointment =  Calendar::updateAppointment(stripslashes(getVar('appointment')));
		echo json_encode($appointment);
		
		
		if (boolval(getVar('sendEmail')) == true) {
			$email = new Email();
			$email->sendAppointmentEmail($appointment,'amended');
				
		}
		 //add a log that an email was sent
		
	break;

	case 'deleteAppointment':
		Calendar::deleteAppointment(getVar('appointmentID'));
	break;
	
	case 'getAppointment':
		echo json_encode(Calendar::getAppointment(getVar('appointmentID')));
	break;

	case 'getFutureAppointments':
	    error_log('getting da shit!!');
		echo json_encode(Calendar::getFutureAppointments(getVar('patientID')));
	break;

	case 'getLastAppointment':
		echo json_encode(Calendar::getLastAppointment(getVar('patientID')));
	break;

	case 'setStatus':
		loadLib('email');
		Calendar::setStatus(getVar('appointmentID'),getVar('status'));
		// send the confirmation email
		// get the appointment details
		$appointment = Calendar::getAppointment(getVar('appointmentID'));
		if ($appointment->status == 0 ){ 
			$email = new Email();
			$email->sendAppointmentEmail($appointment,'confirmation');
			
		}	
		


	break;
	
	case 'addNewPatient':
		
		$oPatient = json_decode(stripslashes(getVar('patient')));
		$group = $group = Clinic::getClinicGroupID($oPatient->clinic);
		$newPatientID = Patient::addNewPatient($oPatient,$group);
		
		setResponse($newPatientID);
	break;

	case 'getServices':
		$services = Service::getServices();
		echo json_encode($services);
	break;

	
	case 'addAppointmentLog':
		Calendar::addAppointmentLog(getVar('appointment_id'),getVar('datetime'),getVar('tag'),getVar('log'),getVar('labelclass'));
	break;

	

	case 'getLog':
		$log = Calendar::getLog(getVar('appointment_id'),getVar('tag'));
		echo json_encode($log);
	break;

	case 'sendEmail':
		loadLib('email');
		$data = json_decode(json_decode(stripslashes(getVar('data')))); 
		
		$email = new Email();
		$email->getServerSettings($data->from);
		$email->to = $data->to;
		$email->subject = $data->subject;
		$email->message = $data->body;
		
		echo $email->send();
		
	break;

}



switch (getView())
{
	
	case 'calendar':
	    
	    //add capabilities check to limit view to certain calendars
		if( current_user_can('clinic_admin') or current_user_can('practitioner') ) { //role or capability
			$selectedUserID = get_current_user_id();
		} else {
			$selectedUserID = 'none';
		}
		$currentUserID =  get_current_user_id();
		$currentUser = wp_get_current_user();
		
		include('views/calendar.php');

	break;

	case 'copy1':
	    
		$user = 1;
		global $wpdb;

		$query = sprintf("SELECT *  FROM table_treatments WHERE practitioner = %s AND scheduled_date BETWEEN '2019-01-01' AND '2025-01-01'",$user);

		$treatments = $wpdb->get_results($query);

	
		
		foreach($treatments as $treatment){
			
			
			
			$sql = "INSERT INTO table_appointments (user,start,end,patient_id,service,clinic,note) VALUES (%d,%s,%s,%d,%d,%d,%s)";
			$user = 1;
			$start = $treatment->scheduled_date . ' ' . $treatment->scheduled_time;
			$end = date('Y-m-d H:i:s',strtotime('+15 minutes',strtotime($start)));
			$patient_id = $treatment->patient_id;
			if ($treatment->type == 1) {$service = 2;}
			if ($treatment->type == 2) {$service = 3;}
			
			$clinic = 1;

			$note = $treatment->comment;
			
			$sql = $wpdb->prepare($sql,$user,$start,$end,$patient_id,$service,$clinic,$note);
			var_dump($sql); // debug
			echo '<BR>';
			$wpdb->query($sql);
		}
		
		
		
		include('views/copy.php'); 

	break;
	case 'copy2':
	    
		$user = 2;
		global $wpdb;

		$query = sprintf("SELECT *  FROM table_treatments WHERE practitioner = %s AND scheduled_date BETWEEN '2019-01-01' AND '2025-01-01'",$user);

		$treatments = $wpdb->get_results($query);

	
		
		foreach($treatments as $treatment){
			
			
			
			$sql = "INSERT INTO table_appointments (user,start,end,patient_id,service,clinic,note) VALUES (%d,%s,%s,%d,%d,%d,%s)";
			$user = 2;
			$start = $treatment->scheduled_date . ' ' . $treatment->scheduled_time;
			$end = date('Y-m-d H:i:s',strtotime('+10 minutes',strtotime($start)));
			$patient_id = $treatment->patient_id;
			if ($treatment->type == 1) {$service = 2;}
			if ($treatment->type == 2) {$service = 3;}
			
			$clinic = 1;

			$note = $treatment->comment;
			
			$sql = $wpdb->prepare($sql,$user,$start,$end,$patient_id,$service,$clinic,$note);
			var_dump($sql); // debug
			echo '<BR>';
			$wpdb->query($sql);
		}
		
		
		
		include('views/copy.php'); 

	break;
	case 'copy3':
	    
		$user = 3;
		global $wpdb;

		$query = sprintf("SELECT *  FROM table_treatments WHERE practitioner = %s AND scheduled_date BETWEEN '2019-01-01' AND '2025-01-01'",$user);

		$treatments = $wpdb->get_results($query);

	
		
		foreach($treatments as $treatment){
			
			
			
			$sql = "INSERT INTO table_appointments (user,start,end,patient_id,service,clinic,note) VALUES (%d,%s,%s,%d,%d,%d,%s)";
			$user = 3;
			$start = $treatment->scheduled_date . ' ' . $treatment->scheduled_time;
			$end = date('Y-m-d H:i:s',strtotime('+10 minutes',strtotime($start)));
			$patient_id = $treatment->patient_id;
			if ($treatment->type == 1) {$service = 2;}
			if ($treatment->type == 2) {$service = 3;}
			
			$clinic = 1;

			$note = $treatment->comment;
			
			$sql = $wpdb->prepare($sql,$user,$start,$end,$patient_id,$service,$clinic,$note);
			var_dump($sql); // debug
			echo '<BR>';
			$wpdb->query($sql);
		}
		
		
		
		include('views/copy.php'); 

	break;


	
	
	
}


?>
