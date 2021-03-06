<?php 
//Component Pictureproof
loadLib('patient');
loadLib('clinic');
loadLib('image');
//loadJS('pictureproof.js','pictureproof');
loadCSS('pictureproof.css','pictureproof');


//get the patient details


switch (getVar('task')){
	
    case 'getCameraPictures':
        $cameraPictures = Image::getImages(getVar('patientID'),'camera');
        echo json_encode($cameraPictures);
    break;

    case 'getPictureProofSavedPictures':
        $pictureProofPictures = Image::getImages(getVar('patientID'),'pictureproof');
        echo json_encode($pictureProofPictures);
	break;
	
	case 'getPortfolioImages':
        $portfolioImages = Image::getImages(getVar('patientID'),'pictureproof');
        echo json_encode($portfolioImages);
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
		Image::insertImage($patientID,$filename,'pictureproof');
		//error_log($img);

		
	break;
	
	case 'deleteImages':
		error_log(getVar('images'));
		Image::deleteImages(json_decode(stripslashes(getVar('images'))));
	break;

	
}





switch (getView())
{
	case 'drag':
		loadJS('fabric.min.js');
		include('views/drag.php');
	break;
	case 'pictureproof':
		loadJS('fabric.min.js');
		loadJS('pictureproof.js','pictureproof');
		
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
		
		include('views/pictureproofV2.php');
	break;

	case 'test':
		loadJS('fabric.min.js');
		loadJS('test.js','pictureproof');
		
		global $current_user;
      	get_currentuserinfo();
		$username = $current_user->user_firstname . ' ' . $current_user->user_lastname;
		
		$patientID = getVar('patient_id');
		$patient = Patient::getPatient($patientID);
		$patientName = $patient->patient_surname.' '.$patient->patient_firstname;
		$patientDOB = $patient->dob;
		$clinic = Clinic::getClinic($patient->clinic);
		$clinicHeader = $clinic->clinic_educate_heading;
		
		
		
		include('views/test.php');
	break;
	
	
	
	
	
	
}


?>
