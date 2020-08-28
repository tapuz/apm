<?php 
//Component Portfolio
loadLib('patient');
loadLib('clinic');
loadLib('image');
//loadJS('pictureproof.js','pictureproof');
loadCSS('portfolio.css','portfolio');


//get the patient details


switch (getVar('task')){
		
	case 'deletePortfolioImages':
		error_log(getVar('images'));
		Image::deletePortfolioImages(json_decode(stripslashes(getVar('images'))));
	break;

	case 'generatePDF':
		//lets make a pdf!!
		
	break;

	case 'emailPortfolio':
		loadLib('email');
		loadLib('clinic');
		$clinic = getVar('clinic');
		$pdfString = getVar('pdf');

		$mail = new Email();
		$mail->getServerSettings(1);
		$mail->to='thierry.duhameeuw@gmail.com';
		$mail->subject='PDF TEST';
		$mail->message='Hier is je PDF';

		$mail->attachment['file']= $pdfString;
		$mail->attachment['filename']='portfolio.pdf';
		$mail->clinic = 1;
		$mail->send();
	break;

	
}





switch (getView())
{
	
	
	case 'portfolio':
		echo '<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.5.3/jspdf.debug.js" integrity="sha384-NaWTHo/8YCBYJ59830LTz/P4aQZK1sS0SneOgAvhsIl3zBu8r9RevNg5lHCHAuQ/" crossorigin="anonymous"></script>';
		loadJS('portfolio.js','portfolio');
		
		global $current_user;
      	get_currentuserinfo();
		$username = $current_user->user_firstname . ' ' . $current_user->user_lastname;
		
		$patientID = getVar('patient_id');
		$patient = Patient::getPatient($patientID);
		$patientName = $patient->patient_surname.' '.$patient->patient_firstname;
		$patientDOB = $patient->dob;
		$clinic = json_encode(Clinic::getClinic($patient->clinic));
		

		
		
		//set the backLink
		$backLink = "index.php?com=patient&view=patient&layout=component&patient_id=" . $patient->patient_id;

		//get the images to include in portfolio
		$pictureproofPictures = Image::getImages(getVar('patientID'),'pictureproof');
		$educatePictures = Image::getImages(getVar('patientID'),'educate');
		
		include('views/portfolio.php');
	break;

	
	
	
	
	
	
	
}


?>
