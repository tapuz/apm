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
		$clinic = Clinic::getClinic(getVar('clinic'));
		$email = getVar('patientEmail');
		$patientName = getVar('patientName');
		$pdfdoc			= base64_decode(getVar('pdf'));



		//$b64file = $pdfdoc;
		//$b64file 		= trim( str_replace( 'data:application/pdf;base64,', '', $pdfdoc ) );
		//$b64file		= str_replace( ' ', '+', $b64file );
		//$decoded_pdf	= base64_decode( $b64file );

		//error_log($decoded_pdf);

		$filepath = '/var/www/timegenics_dev/temp/portfolio.pdf';
		file_put_contents($filepath,$pdfdoc);

		$mail = new Email;
		$mail->getServerSettings($clinic->clinic_id);
		$mail->to=$email;
		$mail->subject=$clinic->email_portfolio_subject;
		$mail->message=$clinic->email_portfolio_message;


		$mail->attachment['file']= $filepath;
		$mail->attachment['filename']='Portfolio_'.$patientName.'.pdf';
		$mail->clinic = $clinic->clinic_id;
		$mail->send();
	break;

	
}





switch (getView())
{
	
	
	case 'portfolio':
		//echo '<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.5.3/jspdf.debug.js" integrity="sha384-NaWTHo/8YCBYJ59830LTz/P4aQZK1sS0SneOgAvhsIl3zBu8r9RevNg5lHCHAuQ/" crossorigin="anonymous"></script>';
		//echo '<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.3.1/jspdf.umd.min.js"></script>';
		loadJS('portfolio.js','portfolio');
		
		global $current_user;
      	get_currentuserinfo();
		$username = $current_user->user_firstname . ' ' . $current_user->user_lastname;
		
		$patientID = getVar('patient_id');
		$patient = Patient::getPatient($patientID);
		$patientName = $patient->patient_surname.' '.$patient->patient_firstname;
		$patientDOB = $patient->dob;
		$patientEmail = $patient->email;
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
