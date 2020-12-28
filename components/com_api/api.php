<?php 
//API methods
loadLib('patient');
//loadLib('clinic');
loadLib('image');
//loadJS('educate.js','educate');
//loadCSS('educate.css','educate');

//get the patient details


switch (getVar('task')){
	
    
    case 'message':
        $message = getVar('message');
        error_log($message);
        error_log('the message should be here');
        
    break;
    case "post_image":
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








?>
