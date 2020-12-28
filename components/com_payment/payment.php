<?php 
//Component Payment
loadLib('payment');
loadLib('clinic');
//loadJS('payment.js','payment');
//loadCSS('payment.css','payment');



switch (getVar('task')){
	
	case 'add_payment':
	    //check if the user has rights to add a payment
	    
	   if(current_user_can('add_payment')){
		Payment::addPayment(getVar('patient_id'),getVar('clinic'),getVar('practitioner_id'),getVar('description'),getVar('amount'),getVar('payment_date'));
		error_log("Adding the payment", 0);
		
		
		setResponse('Payment Registered... !!');
	   }

	 			
	break;

	case 'addPayment':
		$response  = Payment::addPayment(json_decode(stripslashes(getVar('payment'))));
		
	break;
	
	case 'get_clinics':
	    //get the clinics to use in the payment
	    echo $clinics = json_encode(Clinic::getClinics());
	  
	break;
	
	case 'get_fees':
	    echo $fees = json_encode(Payment::getFees());
	break;
	
	case 'get_users':
	    echo $users = json_encode(get_users( 'role=practitioner' ));
	
		
		
		
		
		
		
		
	break;
	

}



switch (getView())
{
	
	case 'list':
	    
	    //get all the payments from the clinics
	    $payments = Payment::getAllPayments();
		//set the backLink
		//$backLink = "index.php?com=patient&view=patient&patient_id=" . $patient_id;
		
		include('views/list.php');

	break;
	
	
}


?>
