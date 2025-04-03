<?php
header('Access-Control-Allow-Origin: *');

include('configuration.php');
require_once ($config['path_wp-config']);

define('ROOT',						dirname(__FILE__));

$APIKey = 'USxgbPOrHHI$bZ1Mos7Bp*q4Q3av8CaUZfaga7*kBp90DEB4s';

//check debug mode

if ($config['debug_mode'] === true)
	{
		error_reporting(E_ALL);
        ini_set('display_errors', 'off');
        ini_set('log_errors', 'on');
        ini_set('error_log', 'error.log');
	}
include('libraries/alice/alice.php');


//API methods

error_log('API: '. getVar('task'));

loadLib('patient');
//loadLib('clinic');
loadLib('image');
loadLib('push');
//loadJS('educate.js','educate');
//loadCSS('educate.css','educate');

//get the patient details

//switch ($_POST('task')){
switch (getVar('task')){
	
	case 'isUserLoggedIn':
		$redirectUrl = getVar('redirectUrl');
		$loginUrl = wp_login_url( $redirectUrl);
		
		$data = new stdClass();
		$data->isUserLoggedIn = is_user_logged_in();
		$data->loginUrl = $loginUrl; 		 
		echo json_encode($data);    
			
	break;

	case 'emailTempNP':
		loadLib('email');
		$email = new Email();
		$email->getServerSettings(1);
		$email->to = 'thierry.duhameeuw@gmail.com';
		$email->subject='NP is booking online';
		$email->message = stripslashes(getVar('patient'));
		$email->send();
	break;

	case 'push':
		//send push
		
		$push = new Push();
		$push->id = 'e1vYyUISFEpJmPJXYraozu:APA91bFxDDBkz5JAPJQ5Ss9rBJmPySWr57tsxomJ_ZqhCUq_seJpK4kjobOQhvzuRM0BuEeHUjrSWY44CqP08G54O1-sMMwN7Y9OxG3nEXv7ukgflqnkL6AsqDtOVHynfTKURNGmxbfE';
		$push->title = getVar('title');
		$push->body = getVar('body');
		$push->send();
		
	break;

	case 'error_match':
		//send email to group admin because patient has difficulty booking appointment via online booking system
		loadLib('email');
		$email = new Email();
		$email->getServerSettings(getVar('clinic'));
		$email->to = getVar('email');
		$email->subject='A patient has problems booking online';
		$email->message = getVar('patient');
		$email->send();

		//send push
		$push = new Push();
		$push->id = 'e1vYyUISFEpJmPJXYraozu:APA91bFxDDBkz5JAPJQ5Ss9rBJmPySWr57tsxomJ_ZqhCUq_seJpK4kjobOQhvzuRM0BuEeHUjrSWY44CqP08G54O1-sMMwN7Y9OxG3nEXv7ukgflqnkL6AsqDtOVHynfTKURNGmxbfE';
		$push->title = 'Patient has problems booking online';
		$push->body = getVar('patient');
		$push->send();

	break;
	case 'getActivePatient':
		loadLib('patient');
		//get the user ID, we get the Email provided
		$user = get_user_by( 'email', getVar('userEmail') );
		
		echo json_encode(Patient::getActivePatient($user->ID));

	break;

	case 'addNewPatient':
	
		$oPatient = json_decode(stripslashes(getVar('patient')));
		$group = $oPatient->group;
		$newPatientID = Patient::addNewPatient($oPatient,$group);
		echo  $newPatientID;
		//setResponse($newPatientID);
	break;
	
    case 'getClinicsFromGroup':
		
		loadLib('clinic');
		$clinics = Clinic::getClinicsFromGroup(getVar('group'));
		error_log('CLINICS --> ' . print_r($clinics,1));
		echo json_encode($clinics);			
		
		
	break;
	case 'getPractitionersFromClinic':
		loadLib('clinic');
		loadLib('service');
		$clinic = getVar('clinic');
		$practitioners = Clinic::getPractitionersFromClinic($clinic);
		

		foreach($practitioners as $practitioner){
			$practitioner->{"default_service"} = Service::getRecurrentService($clinic,$practitioner->ID);
			$practitioner->{"default_service_urgent"} = Service::getRecurrentUrgentService($clinic,$practitioner->ID);
			$practitioner->{"default_service_np"} = Service::getNPService($clinic,$practitioner->ID);
			$practitioner->{"default_service_np_urgent"} = Service::getNPUrgentService($clinic,$practitioner->ID);
			$practitioner->{"services"} = Service::getAllServices($clinic);
		}

		
		echo json_encode($practitioners);
		//error_log(json_encode(Clinic::getPractitionersFromClinic(getVar('clinic'))));
	break;

	case 'update_patient_field':
		Patient::updatePatientField(getVar('patient_id'),getVar('field'),getVar('value'));
	break;

	case 'findPatientMatch':
		echo(Patient::findPatientMatch(getVar('patient')));
	break;
    case 'message':
        $message = getVar('message');
        error_log($message);
        error_log('the message should be here');
        
    break;
	
	case 'addToWaitinglist':
		loadLib('calendar');
		loadLib('email');
		loadLib('push');
		
		$demand =  Calendar::addToWaitinglist(json_decode(stripslashes(getVar('demand'))));
		echo json_encode($demand);//$demand = stripslashes(getVar('urgent_demand'));

		$email = new Email();
		$email->sendAppointmentEmail($demand,'addedToWaitinglist');

		$mail = new Email();
		$mail->getServerSettings(2);
		$mail->to = 'info@rugcentrumgent.be';
		$mail->subject='New urgent request';
		$mail->message = json_encode($demand);
		$mail->send();

		$push = new Push();
		$push->id = 'e1vYyUISFEpJmPJXYraozu:APA91bFxDDBkz5JAPJQ5Ss9rBJmPySWr57tsxomJ_ZqhCUq_seJpK4kjobOQhvzuRM0BuEeHUjrSWY44CqP08G54O1-sMMwN7Y9OxG3nEXv7ukgflqnkL6AsqDtOVHynfTKURNGmxbfE';
		$push->title = 'Urgent appointment request';
		$body = $demand->resourceName.' : ('.$demand->patient_id . ') - '. $demand->patient_surname . ' ' . $demand->patient_firstname .' - Service: '.$demand->description;   

		$push->body = $body;
		$push->send();
		
		

	break;

	case 'deleteAppointment':
		loadLib('calendar');
		$appointmentID =  getVar('appointmentID');
		Calendar::deleteAppointment($appointmentID);
	break;

	case 'addAppointment':
		loadLib('calendar');
		loadLib('email');
		loadLib('push');
		$appointment =  json_decode(stripslashes(getVar('appointment')));
		$group = $appointment->group;
		
		$appointment =  Calendar::addAppointment(json_decode(stripslashes(getVar('appointment'))));
		echo json_encode($appointment);
		error_log(json_encode($appointment));
		
		$datetime = date("Y-m-d H:i:s");
		Calendar::addAppointmentLog($appointment->id,$datetime,'New','New appointment with online booking','label-success');
		
		//send confirmation email to patient
		$email = new Email();
		$email->sendAppointmentEmail($appointment,'confirmation');
		
		//send mail to group admin
		$mail = new Email();
		$mail->sendOnlineBookingReport($appointment);
		
		
		//send push
		
		if ($group == 1){
			$push = new Push();
			$push->id = 'e1vYyUISFEpJmPJXYraozu:APA91bFxDDBkz5JAPJQ5Ss9rBJmPySWr57tsxomJ_ZqhCUq_seJpK4kjobOQhvzuRM0BuEeHUjrSWY44CqP08G54O1-sMMwN7Y9OxG3nEXv7ukgflqnkL6AsqDtOVHynfTKURNGmxbfE';
			$push->title = 'New online booking';
			$body = $appointment->resourceName.' : ('.$appointment->patientID.') - '.$appointment->patientName.' - Service: '.$appointment->serviceId;   

			$push->body = $body;
			$push->send();
		}
		
		
		//add the email
		//test CURL
		
		$params = [];
		$params['APIKey'] = $APIKey;
		$params['com']='calendar';
		$params['task']='addAppointment';
		$params['appointment'] =json_encode($appointment);

		//$test = httpPost_c('http://www.timegenics.com/app/ajax.php',$params);



	break;

	case "upload_image":
		//$patientID = getVar('patientID');
		$patientID = $_POST['patientID'];
		$tag = $_POST['tag'];
		error_log('UPLOADING!!!');
		error_log('TAG: ' + $tag);

		error_log(dirname(__FILE__));
		$filename = basename($_FILES["photo"]["name"]);
		error_log($filename);
		$target_dir = ROOT . "/userdata/camera_pictures/";
		$target_file = $target_dir . basename($_FILES["photo"]["name"]);
		$uploadOk = 1;
		$imageFileType = pathinfo($target_file,PATHINFO_EXTENSION);
		$check = getimagesize($_FILES["photo"]["tmp_name"]);
		if($check !== false) {
			error_log( "File is an image - " . $check["mime"] . ".");
			$uploadOk = 1;
			if (move_uploaded_file($_FILES["photo"]["tmp_name"], $target_file)) {
				error_log( "The file ". basename( $_FILES["photo"]["name"]). " has been uploaded.");
				//link image with patient in DB
			    Image::insertImage($patientID,$filename,$tag);
			} else {
				error_log( "Sorry, there was an error uploading your file.");
			}
		} else {
			error_log( "File is not an image.");
			$uploadOk = 0;
		}
	break;

    case "post_image": //NOT USED ANYMORE!!!
        define('UPLOAD_DIR', 'userdata/camera_pictures/');
        //the vars that need to be posted
		error_log('post_image_called');
		
		$request_body = file_get_contents('php://input');
		
		$data = json_decode($request_body);
        $img = $data->image;
        $patientID = $data->patientID;

        $img = str_replace('data:image/jpeg;base64,', '', $img);
		$img = str_replace(' ', '+', $img);
		$data = base64_decode($img);
		$myimage = imagecreatefromstring($data);
		$filename = uniqid($patientID.'_test_posture_') . '.jpg';
		//compress the png
		//imagepng($myimage, $file);
		$savePath = UPLOAD_DIR . $filename;
		imagejpeg($myimage,$savePath);
		
		//link image with patient in DB
		Image::insertImage($patientID,$filename,'camera');
		
    break;
    
	case 'saveToPatientPortfolio':
		
		// create the image
	 	define('UPLOAD_DIR', 'userdata/portfolio_images/');
		$patientID = getVar('patientID');
		$patientName=getVar('patientName');
		$patientDOB =getVar('patientDOB');
		
		$img = getVar('imgBase64');
		$img = str_replace('data:image/jpeg;base64,', '', $img);
		$img = str_replace(' ', '+', $img);
		$data = base64_decode($img);
		$myimage = imagecreatefromstring($data);
		$filename = uniqid($patientID.'_') . '.jpg';
		//compress the png
		//imagepng($myimage, $file);
		$savePath = UPLOAD_DIR . $filename;
		imagejpeg($myimage,$savePath);
		
		//link image with patient in DB
		Image::insertImage($patientID,$filename,'educate');
		
		
		loadExtLib('fpdf');
		$pdf = new FPDF();
		$pdf->AddPage();
		$pdf->SetFont('Arial','B',16);
		$pdf->Cell(0,10,$patientName . ' (' .$patientDOB . ')' );
		$pdf->Ln();
		$pdf->Image($savePath	,null,null,-150);
		//$pdf->Output();
		$filename="/var/www/clients/client2/web51/web/wp_dev/alice/userdata/pdf/mysuperpdf.pdf";
		$pdf->Output($filename,'F');
		
	break;
	
	case 'getAvailableTimes':
		
		loadLib('calendar');
		loadLib('service');
		$user = getVar('user'); //1;
		$clinic = getVar('clinic');
		$timing = getVar('timing');
		//how many working days we want to check??
		$start = getVar('start'); 
		$service = getVar('service');
		$duration = getVar('duration');
		$timezone = "Europe/Brussels";
		date_default_timezone_set($timezone);


		$days=get_user_meta( $user, 'online_booking_days_in_future',true);
		$timeslots_to_retain_per_day = get_user_meta( $user, 'online_booking_timeslots_per_day',true);
		$max_timeslots_search_for = get_user_meta( $user, 'online_booking_timeslots_to_propose',true);
		$min_delta_to_first_timeslot = get_user_meta( $user, 'online_booking_delta_to_first_timeslot',true); //min time to first timeslot... ex.. its 11:00 , so propose 11:00 + 60seconds
		//error_log('CHECKING FOR DAYS : ' . $days);
		$try_block_book = FALSE;
		$timeslots_to_present = array();
		$date = new DateTime($start);
		for ($i = 0; $i < $days; $i++) {
			
			//error_log('DAY ' . $i);
			$selected_date = $date->format('Y-m-d');
			$availableTimeslots = Calendar::getUserAvailableTimeslots($user,$clinic,$selected_date,$duration,$timing,$min_delta_to_first_timeslot,$service);
			
			if ($availableTimeslots!=FALSE){
				
				//error_log(print_r($availableTimeslots,1));
				//usort($timeslots_to_present, function($a, $b) {
				//	return $a['priority'] - $b['priority'];
				//});
				//error_log('COUNT: ' . $selected_date . '-- '  . count($availableTimeslots));
				//$timeslots_to_retain = $availableTimeslots;
				// Sort the array in descending order based on priority
				usort($availableTimeslots, function($a, $b) {
					return $b['priority'] <=> $a['priority'];
				});

				// Iterate through the array and delete elements with priority 3 and then priority 2
				foreach ($availableTimeslots as $key => $timeslot) {
					if ($timeslot['priority'] === 3 && count($availableTimeslots) > $timeslots_to_retain_per_day || ($timeslot['priority'] === 2 && count($availableTimeslots) > $timeslots_to_retain_per_day)) {
						unset($availableTimeslots[$key]);
					}
					if (count($availableTimeslots) === $timeslots_to_retain_per_day) {
						break;
					}
				}

				// Reset array keys
				$availableTimeslots = array_values($availableTimeslots);	


				//$timeslots_to_retain = array_slice($availableTimeslots,0,$timeslots_to_retain_per_day);
				$timeslots_to_present = array_merge($timeslots_to_present,$availableTimeslots);
				//error_log("here are the ones to retain");
				//error_log(print_r($timeslots_to_retain,1));
			} else {
				//no available timeslots for this day , look in an extra day
				//$days++;
			}
			
				
			if(count($timeslots_to_present) >= $max_timeslots_search_for){
				//error_log('we should break stop searching!!');
				//break;
			}
			
			//error_log('TOTAL ' . count($timeslots_to_present));
			$date->modify('+' . 1 . ' days');
		}
		
		
		
		
		
		//experimental// not in use
		if ($try_block_book){
			//lets chop off those low priority bookings
			//sort timeslots by priority
			$sort = array();
			foreach($timeslots_to_present as $k=>$v) {
				$sort['priority'][$k] = $v['priority'];
				//$sort['start'][$k] = $v['start'];
			}
			//# sort by event_type desc and then title asc
			array_multisort($sort['start'], SORT_DESC, $sort['priority'], SORT_ASC,$timeslots_to_present);
			
			
			
			//if we have more timeslots then needed... keep only the needed amount
			//of timeslots = $max_timeslots_search_for
			if(count($timeslots_to_present) > $max_timeslots_search_for){
				//$timeslots_to_present = array_slice($availableTimeslots,0,$max_timeslots_search_for);
			}
			
		}

		//sort array by timeslot start time
			
		usort($timeslots_to_present, function($a, $b) {
			return strtotime($a['start']) - strtotime($b['start']);
		});
		
	
		//reset the array keys to 0,1,2,... as some keys were deleted.. otherwize the JS calendar will not accept the array
		$timeslots_to_present = array_values($timeslots_to_present);
		//error_log(print_r($timeslots_to_present,1));
		echo json_encode($timeslots_to_present);
		
		
	break;
	
	
	case 'test':
		
		$i = 0;
		
		global $wpdb;
		$query='SELECT * from table_treatments';
		$appointments=$wpdb->get_results($query);
		return $appointments;
		
		foreach($appointments as $appointment){
					
								echo $appointment->scheduled_date;
							
					}
					
		
		
		
		
	break;
	
}


function httpPost_c($url, $data){
    $curl = curl_init($url);
    curl_setopt($curl, CURLOPT_POST, true);
    curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($data));
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($curl);
    curl_close($curl);
    return $response;
}

function httpPost($url, $data){
	$options = array(
		'http' => array(
			 'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
			'method'  => 'POST',
			'content' => http_build_query($data)
		)
	);
	$context  = stream_context_create($options);
	return file_get_contents($url, false, $context);
}



?>
