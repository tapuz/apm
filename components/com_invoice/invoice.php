<?php 
//Component Invoice NEW
loadLib('patient');
loadLib('invoice');
loadLib('payment');

loadJS('invoice.js','invoice');
loadCSS('invoice.css','invoice');

$patient_id = getVar('patient_id');

switch (getVar('task')){
	
	case 'create_new_invoice':
		$patient = Patient::getPatient($patient_id);
		
		$invoice = new Invoice();
		$invoice->patient_id = $patient_id;
		$invoice->clinic_id = $patient->clinic;
		$invoice->address = $patient->patient_surname.' '.$patient->patient_firstname .'<br>'.$patient->address . '<br>' . $patient->postcode . ' ' . $patient->city . '<br>' . $patient->country;
		$invoice->insertInvoice();
		
		$invoice_id = $invoice->invoice_id; // get the ID to be used in edit_invoice view	
	 			
	 			
	break;
	
	case 'delete_invoice':
		Invoice::deleteInvoice(getVar('invoice_id'));	
	break;
	
	case 'add_invoice_item':
		
		//set payment to invoiced
		
		Payment::setPaymentInvoicedStatus(getVar('payment_id'),1);
		
		
		$invoice_item = new Invoice();
		$invoice_item->invoice_id = getVar('invoice_id');
		$invoice_item->payment_id = getVar('payment_id');
		$invoice_item->item_description = getVar('item_description');
		$invoice_item->item_price = getVar('item_price');
		$invoice_item->addInvoiceItem();
		
		
		echo '<div id="response">' . $invoice_item->invoice_item_id . '</div>';
		
	break;
	
	case 'delete_invoice_item':
		Invoice::deleteInvoiceItem(getVar('invoice_item_id'));
		Payment::setPaymentInvoicedStatus(getVar('payment_id'),0);
	break;
	
	case 'update_sum_invoice':
		Invoice::updateInvoiceTotal(getVar('invoice_id'),getVar('total'));
	break;

	case 'saveInvoice':
		Invoice::saveInvoice(getVar('invoice_id'),getVar('note'));
	break;
	
}





switch (getView())
{
	
	case 'list':
		//get all invoices
		
		//get user
		$invoices = Invoice::getInvoices($patient_id);
		$patient = Patient::getPatient($patient_id);
		//set the backLink
		$backLink = "index.php?com=patient&view=patient&patient_id=" . $patient_id;
		$pageTitle = "Invoices for " . $patient->patient_surname.' '.$patient->patient_firstname;
		include('views/list.php');

	break;
	
	case 'edit_invoice':
		$user_id = get_current_user_id();
		// get all the uninvoiced payments for the a patient.. 
	    $payments = Payment::getPayments($patient_id,0);		
        
        	
		$appointments = Patient::getAppointments($patient_id);
		$patient = Patient::getPatient($patient_id);
		
		if (getVar('invoice_id') != NULL) //a call was made from the list view
		{
			$invoice_id = getVar('invoice_id');
			
		} // if letter_id == NULL -> a call was made to create a new invoice. invoice_id is passed from the create_new_invoice task 
		$invoice = Invoice::getInvoice($invoice_id);
		$invoice_date = new DateTime($invoice->date);	
		
		//get all invoice items
		
		$invoice_items = Invoice::getInvoiceItems($invoice_id);
		
		//get the invoice heading for the clinic
		
		$invoice_heading = Invoice::getInvoiceHeading($patient->clinic);
		
		//get the practitioner name and signature for the invoice
		
		$user=get_userdata($patient->practitioner);
		
		$practitioner = get_userdata($patient->practitioner);
		$practitioner_name = $practitioner->user_lastname . ' ' . $practitioner->user_firstname;
		
		
		$signature_url = $config['signature_path'] . get_user_meta($practitioner->ID,'signature',true) ;
		$signature = sprintf('<img src="%s">',$signature_url); 
		
		//set the backLink
		$backLink = "index.php?com=invoice&view=list&patient_id=" . $patient->patient_id;
		
		$pageTitle = "Invoice for " . $patient->patient_surname.' '.$patient->patient_firstname;
		
		include('views/edit_invoice.php');
		
	break;
	
	
}


?>
