<?php
class Payment {

public function getAllPayments() {
    global $wpdb;
	$query='
	SELECT * FROM table_payments
	ORDER BY payment_id DESC';
	$payments=$wpdb->get_results($query);
	return  $payments;
    
    
}

public function getPayments($patient_id,$status) {
    global $wpdb;
    $query= sprintf('SELECT * from table_payments WHERE patient_id = "%s" AND invoiced=%s',$patient_id,$status);
    $payments = $wpdb->get_results($query);
    return $payments;
}

public function setPaymentInvoicedStatus($payment_id,$status) {
    global $wpdb;
    $wpdb->update( 
				'table_payments', 
				array( 
					'invoiced' => $status
					),
				array( 'payment_id' => $payment_id) 
		 		
	 			);
}

public function addPayment($payment){
	
	
	
    global $wpdb;
		$wpdb->insert( 
				'table_payments', 
				array( 
					'clinic_id' => $payment->clinic_id,
					'patient_id' => $payment->patient_id, 
					'practitioner_id' => $payment->user,
					'description' => $payment->description,
					'amount' => $payment->fee,
					'payment_date' => $payment->date
					) 
	 			);
	if ($wpdb->last_error) {
	  echo 'error saving the payment: ' . $wpdb->last_error;
	  throw new Exception();
	}	 
}

public function getFees() {
    global $wpdb;
	$query='SELECT * from table_fees';
	$fees=$wpdb->get_results($query);
	return  $fees;
    
    
}




}

?>