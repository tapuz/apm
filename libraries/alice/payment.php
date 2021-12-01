<?php
class Payment {

public function getAllPayments() {
    global $wpdb;
	$query='
	SELECT * FROM table_payments where payment_date = 
	ORDER BY payment_id DESC';
	$payments=$wpdb->get_results($query);
	return  $payments;
    
    
}

public static function getPaymentSummary($practitioner,$clinic,$date){
	global $wpdb;
	$query=sprintf("
	SELECT
		table_payment_methods.id,
		table_payment_methods.method,
		SUM(amount) as totalamount,count(*) as patients
		from table_payments INNER JOIN table_payment_methods
		ON table_payments.method = table_payment_methods.id
		where `payment_date` = '%s' AND table_payments.practitioner_id= %s AND table_payments.clinic_id=%s group by method with ROLLUP
	",$date,$practitioner,$clinic);

	error_log($query);

	return $summary = $wpdb->get_results($query); 
	
}

public static function getMethods() {
	global $wpdb;
	$query='
	SELECT * FROM table_payment_methods';
	$methods=$wpdb->get_results($query);
	return  $methods;
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
					'method' => $payment->method,
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