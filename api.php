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

error_log('API: '.getVar('task'));

loadLib('patient');
//loadLib('clinic');
loadLib('image');
//loadJS('educate.js','educate');
//loadCSS('educate.css','educate');

//get the patient details

//switch ($_POST('task')){
switch (getVar('task')){
	case 'error_match':
		//send email to group admin because patient has difficulty booking appointment via online booking system
		loadLib('email');
		$email = new Email();
		$email->getServerSettings(getVar('clinic'));
		$email->to = getVar('email');
		$email->subject='A patient has problems booking online';
		$email->message = getVar('patient');
		$email->send();
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
			$practitioner->{"default_service_np"} = Service::getNPService($clinic,$practitioner->ID);
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
	
	case 'addAppointment':
		loadLib('calendar');
		loadLib('email');
		$appointment =  json_decode(stripslashes(getVar('appointment')));
		$appointment =  Calendar::addAppointment(json_decode(stripslashes(getVar('appointment'))));
		echo json_encode($appointment);
	
		$datetime = date("Y-m-d H:i:s");
		Calendar::addAppointmentLog($appointment->id,$datetime,'New','New appointment with online booking','label-success');
		
		//send confirmation email
		$email = new Email();
		$email->sendAppointmentEmail($appointment,'confirmation');
		
		//send
		$mail = new Email();
		$mail->getServerSettings(2);
		$mail->to = 'thierry.duhameeuw@gmail.com';
		$mail->subject='NEW ONLINE BOOKING';
		$mail->message = json_encode($appointment);
		$mail->send();
		
		
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
		$duration = getVar('duration');

		$timezone = "Europe/Brussels";
		date_default_timezone_set($timezone);


		$days=get_user_meta( $user, 'online_booking_days_in_future',true);
		$timeslots_to_retain_per_day = get_user_meta( $user, 'online_booking_timeslots_per_day',true);
		$max_timeslots_search_for = get_user_meta( $user, 'online_booking_timeslots_to_propose',true);
		$min_delta_to_first_timeslot = get_user_meta( $user, 'online_booking_delta_to_first_timeslot',true); //min time to first timeslot... ex.. its 11:00 , so propose 11:00 + 60seconds
		error_log('CHECKING FOR DAYS : ' . $days);
		$try_block_book = FALSE;
		$timeslots_to_present = array();
		$date = new DateTime($start);
		for ($i = 0; $i < $days; $i++) {
			
			//error_log('DAY ' . $i);
			$selected_date = $date->format('Y-m-d');
			$availableTimeslots = Calendar::getUserAvailableTimeslots($user,$clinic,$selected_date,$duration,$timing,$min_delta_to_first_timeslot);
			
			if ($availableTimeslots!=FALSE){
				
				//error_log(print_r($availableTimeslots,1));
				//usort($timeslots_to_present, function($a, $b) {
				//	return $a['priority'] - $b['priority'];
				//});
				$timeslots_to_retain = array_slice($availableTimeslots,0,$timeslots_to_retain_per_day);
				$timeslots_to_present = array_merge($timeslots_to_present,$timeslots_to_retain);
				//error_log(print_r($timeslots_to_retain,1));
			} else {
				//no available timeslots for this day , look in an extra day
				//$days++;
			}
			
				
			if(count($timeslots_to_present) >= $max_timeslots_search_for){
				error_log('we should break stop searching!!');
				break;}
			
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
		//error_log(print_r($timeslots_to_present,1));
		error_log('NUMBER OF TIMESLOTS :' . count($timeslots_to_present));
		// only keep 
		$priority = 3;
		//if (($key = array_search($priority, $timeslots_to_present)) !== false) {
 		//   unset($timeslots_to_present[$key]);
	//	}
		
		foreach ($timeslots_to_present as $k=>$v){
			if (intval($v['priority']) == 3) {
				unset($timeslots_to_present[$k]);
				
			}
			
		}
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
