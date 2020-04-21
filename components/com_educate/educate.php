<?php 
//Component Educate
loadLib('patient');
loadLib('clinic');
loadLib('image');
loadJS('fabric.min.js');
loadJS('educate.js','educate');
//loadCSS('educate.css','educate');

//get the patient details


switch (getVar('task')){
	
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
		
		
		/* loadExtLib('fpdf');
		$pdf = new FPDF();
		$pdf->AddPage();
		$pdf->SetFont('Arial','B',16);
		$pdf->Cell(0,10,$patientName . ' (' .$patientDOB . ')' );
		$pdf->Ln();
		$pdf->Image($savePath	,null,null,-150);
		//$pdf->Output();
		$filename="/var/www/clients/client2/web51/web/wp_dev/alice/userdata/pdf/mysuperpdf.pdf";
		$pdf->Output($filename,'F'); */
		
	break;

	case 'getPortfolioPictures':
        $portfolioPictures = Image::getImages(getVar('patientID'),'educate');
        echo json_encode($portfolioPictures);
    break;
	

	
}





switch (getView())
{
	
	case 'educate':
		
		global $current_user;
      	get_currentuserinfo();
		
		$username = $current_user->user_firstname . ' ' . $current_user->user_lastname;
		
		$patientID = getVar('patient_id');
		$patient = Patient::getPatient($patientID);
		$patientName = $patient->patient_surname.' '.$patient->patient_firstname;
		$patientDOB = $patient->dob;
		
		$clinic = Clinic::getClinic($patient->clinic);
		$clinicHeader = $clinic->clinic_educate_heading;
		
		//get the portfolio images
		$images = Image::getImages($patientID,'educate');
		$backLink = "index.php?com=patient&view=patient&layout=component&patient_id=" . $patient->patient_id;
		
		include('views/educate.php');
	break;
	
	
	
}


?>
