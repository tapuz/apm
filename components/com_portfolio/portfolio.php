<?php 
//Component Pictureproof
loadLib('patient');
loadLib('clinic');
loadLib('image');
//loadJS('pictureproof.js','pictureproof');
loadCSS('portfolio.css','portfolio');


//get the patient details


switch (getVar('task')){

    case 'getPortfolioPictures':
        $portfolioPictures = Image::getImages(getVar('patientID'),'pictureproof');
        echo json_encode($portfolioPictures);
    break;
    
	
	case 'deleteImages':
		error_log(getVar('images'));
		Image::deleteImages(json_decode(stripslashes(getVar('images'))));
	break;

	
}





switch (getView())
{
	
	case 'pictureproof':
		loadJS('fabric.min.js');
		loadJS('portfolio.js','portfolio');
		
		global $current_user;
      	get_currentuserinfo();
		$username = $current_user->user_firstname . ' ' . $current_user->user_lastname;
		
		$patientID = getVar('patient_id');
		$patient = Patient::getPatient($patientID);
		$patientName = $patient->patient_surname.' '.$patient->patient_firstname;
		$patientDOB = $patient->dob;
		$clinic = Clinic::getClinic($patient->clinic);
		$clinicHeader = $clinic->clinic_educate_heading;
		//get patient height
		$height = Patient::getHeight($patientID);

		//set active patient
		Patient::setActivePatient($patientID);
		
		//set the backLink
		$backLink = "index.php?com=patient&view=patient&layout=component&patient_id=" . $patient->patient_id;
		
		include('views/portfolio.php');
	break;

	
	
	
	
	
	
	
}


?>
