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

    $clinic      = Clinic::getClinic(getVar('clinic'));
    $email       = getVar('patientEmail');
    $patientName = getVar('patientName');

    // Option A: PDF is uploaded as multipart/form-data (Blob -> FormData -> $_FILES)
    if (empty($_FILES['pdf']) || !is_uploaded_file($_FILES['pdf']['tmp_name'])) {
        http_response_code(400);
        echo 'No PDF uploaded';
        break;
    }

    if (!empty($_FILES['pdf']['error']) && $_FILES['pdf']['error'] !== UPLOAD_ERR_OK) {
        http_response_code(400);
        echo 'Upload error: ' . (int)$_FILES['pdf']['error'];
        break;
    }

    $pdfdoc = file_get_contents($_FILES['pdf']['tmp_name']);
    if ($pdfdoc === false || $pdfdoc === '') {
        http_response_code(400);
        echo 'Empty PDF upload';
        break;
    }

    // Optional sanity check
    if (strncmp($pdfdoc, '%PDF', 4) !== 0) {
        http_response_code(400);
        echo 'Uploaded file is not a valid PDF';
        break;
    }

    $filename     = 'Portfolio_' . ($patientName ?? 'patient') . '.pdf';
    $safeFilename = basename(preg_replace('/[^A-Za-z0-9._-]/', '_', $filename));
    $filepath     = '/var/www/timegenics_dev/temp/' . $safeFilename;

    file_put_contents($filepath, $pdfdoc);

    $mail = new Email();
    $mail->getServerSettings($clinic->clinic_id);
    $mail->to      = $email;
    $mail->subject = (string)($clinic->email_portfolio_subject ?? 'Portfolio');
    $mail->message = (string)($clinic->email_portfolio_message ?? '');

    // IMPORTANT: this is a PATH; your send() now handles pdf paths via addAttachment()
    $mail->attachment['file']     = $filepath;
    $mail->attachment['filename'] = $filename;
    $mail->clinic = $clinic->clinic_id;

    echo $mail->send();
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
