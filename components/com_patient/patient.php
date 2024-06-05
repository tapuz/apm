<?php
//patient component
loadLib('patient');
loadLib('image');
loadCSS('search.css','patient');
loadCSS('patient.css','patient');



define('COMPONENT','patient');
define('TEMPLATES', ROOT . '/components/com_' . COMPONENT . '/templates/');
$patient_id = getVar('patient_id');

switch(getView()){
	case 'search_patients':
		//loadView();
		loadJS('mustache.min.js');
		loadJS('search-patient.js','patient');
		//get expected patients for practitioner to select from
        $patients_for_today = 	Patient::getPatientsForToday(); 
		include ('views/search.php');
	break;
	case 'patient':
		if( !current_user_can('open_patient_file') ) { //role or capability
			echo "You do not have permission...";
			exit();

		}
		loadCSS('encounters.css','patient');
		loadJS('encounter.js','patient');
		loadJS('appointment.js','calendar');
		loadJS('diagnosis.js','patient');
		loadJS('complaint.js','patient');
		loadJS('soap.js','patient');
		loadJS('mustache.min.js');
		loadJS('patient.js','patient');
		loadJS('com_patient.js','patient');
		loadJS('rightPanel.js','patient');
		loadJS('history.js','patient');
		loadExtJS('https://cdn.jsdelivr.net/npm/jquery-validation@1.19.3/dist/jquery.validate.min.js');
		loadJS('emailModal.js','calendar');
		loadJS('email.js','calendar');
		loadJS('bootstrap-list-filter.min.js');
		loadJS('bootstrap-tagsinput.min.js');
		loadJS('fabric.min.js');
		loadExtJs('https://cdn.jsdelivr.net/npm/chart.js@2.9.4/dist/Chart.min.js');
		loadJS('graphs.js','patient');
		loadCSS('bootstrap-tagsinput.css');
		loadLib('clinic');
		loadJS('socket.io.min.js');
		loadJS('cast.js','calendar');


		
		//loadView();
		//get patient details according to patient_id in url query
			
		$patient = Patient::getPatient(getVar('patient_id'));
		$clinics = Clinic::getClinics(get_current_user_id());
		//get user info
		$user=get_userdata($patient->practitioner);
		//get appointments
		//$appointments = Patient::getAppointments($patient->patient_id);
	
		//get user_id
		
		$practitioner_id = get_current_user_id();
		$userID = get_current_user_id();
		
		//set active patient
		Patient::setActivePatient($patientID);
		
		//$letterCount = letterCount();//used in de patient_menu module
		if (isset($_GET['appointment_id'])) {
			$appointment_id = getVar('appointment_id');
		} else {
			$appointment_id = 'null';
		}
	
		
		include('views/patient.php');
		
	break;
}
switch(getTask()){
	case 'saveDoc':
		
		// create the image
	 	define('UPLOAD_DIR', 'userdata/camera_pictures/');
		$patientID = getVar('patientID');
		
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
		Image::insertImage($patientID,$filename,'doc');
		//error_log($img);

		
	break;
		
	case 'search':// has to be updated in the future.. keep as is for now
		$name = getVar('name');
		$user = get_current_user_id();
		$patients = Patient::searchPatients($name,$user);
		include('views/search_results.php');
	break;

	
	case 'addEncounter':
		$encounter = Patient::addEncounter(json_decode(stripslashes(getVar('encounter'))));
		echo json_encode($encounter);
	break;

	case 'deleteEncounter':
		patient::deleteEncounter(getVar('encounter_id'));
	break;

	case 'deletePatient':
		patient::deletePatient(getVar('patientID'));
	break;
	
	
	
	case 'getEncounters' :
		$encounters = Patient::getEncounters(getVar('patient_id'));
		echo json_encode($encounters);
	break;

	case 'addSOAP':
		$SOAP = Patient::addSOAP(json_decode(stripslashes(getVar('SOAP'))));
		echo json_encode($SOAP);
	break;
	
	case 'updateSOAP':
		
		$SOAP = json_decode(stripslashes(getVar('SOAP')),true);
		$result = Patient::updateSOAP($SOAP);
		if ($result >= 0 AND $result !== false) {
			echo '{"success" : 1}';
		} else {
			echo '{"success" : 0}';
		}
		
	break;

	case 'saveSOAP':
		Patient::saveSOAP(getVar('soap_id'),getVar('field'),stripslashes(getVar('value')));
	break;

	case 'updateComplaint':
		$complaint = json_decode(stripslashes(getVar('complaint')),true);
		$result = Patient::updateComplaint($complaint);
		echo json_encode($complaint);
	break;

	case 'saveComplaint':
		Patient::saveComplaint(getVar('complaint_id'),getVar('field'),stripslashes(getVar('value')));
	break;
		
	case 'addComplaint':
		$complaint = Patient::addComplaint(json_decode(stripslashes(getVar('complaint'))));
		echo json_encode($complaint);
	break;

	case 'deleteComplaint':
		Patient::deleteComplaint(getVar('complaint_id'));
		

	case 'getDiagnoses':
		$diagnoses = Patient::getDiagnoses(getVar('patient_id'));
		echo json_encode($diagnoses);
	break;

	case 'searchDiagnoses':
		$q = getVar('q');
		echo json_encode(Patient::searchDiagnoses($q));
	break;
	
	case 'addNewDiagnosis':
		echo $id = Patient::addNewDiagnosis(getVar('diagnosis'));
		error_log($id);
	break;
	
	case 'addDiagnosis': //adding a diagnosis to a complaint..
		
		$data = stripslashes(getVar('diagnosis'));
		parse_str($data);
		//first check if the actual complaint already has a diagnosis... if not add one..
		if (Patient::doesComplaintHaveDiagnosisForThisEncounter($complaint,$encounter)){ // a diagnosis already exist
			//check if this is the first encounter for this complaint..
				error_log('YES...update');
				Patient::updateDiagnosis($data);
						
		} else { //there is no diagnosis yet for this complaint.. add one
			//add diagnosis
			$result = Patient::addDiagnosis($data);
		}
		
		
			echo '{"success" : 1}';
		
		
		
	break;

	case 'getHistory':
		$history = Patient::getHistory(getVar('patient_id'));
		echo json_encode($history);
	break;

	case 'saveHistory': //save history field
		Patient::saveHistory(getVar('patient_id'),getVar('field'),stripslashes(getVar('value')));
		error_log(stripslashes(getVar('value')) . getVar('field'));
	break;

	case 'addVitals':
		error_log('got the task');
		Patient::addVitals(getVar('vitals'));

	break;
	case 'getVitals': //save history field
		$vitals = Patient::getVitals(getVar('patient_id'));
		echo json_encode($vitals);
		error_log(json_encode($vitals));
	break;

	case 'save_notes':
		//$notes = $_POST["notes"];
		$notes = getVar('notes');
		
		$wpdb->update( 
		'table_patients', 
		array( 
			'notes' => getVar('notes'),
			), 
		array( 'patient_id' => getVar('patient_id')) 
		 
		);
		
	break;

	case 'get_patient':
		$patient = Patient::getPatient($patient_id);
		echo json_encode($patient);
	break;

	case 'update_patient':
		echo json_encode(Patient::updatePatient($patient_id,getVar('patient')));

		
	break;

	case 'set_active_patient':
		Patient::setActivePatient(getVar('patient'));
	break;

	case 'getDocuments':
		
			$docs = Image::getImages(getVar('patientID'),'doc');
			echo json_encode($docs);
		
	break;

		

 }
?>





