<?php
class Invoice {

public $invoice_id;
public $address;
public $patient_id;
public $date;
public $clinic_id;

public $invoice_item_id;
public $item_description;
public $item_price;
public $payment_id;

	public function  getInvoice($invoice_id)	{
		global $wpdb;
		$query=sprintf('SELECT * from table_invoices WHERE invoice_id = "%s"',$invoice_id);
		$invoice=$wpdb->get_row($query);
					return  $invoice;
				
	}
	
	public function insertInvoice() {
		global $wpdb;
		$wpdb->insert( 
				'table_invoices', 
				array( 
					'patient_id' => $this->patient_id, 
					'clinic_id' => $this->clinic_id,
					'date' => date("Ymd"),
					'address' => $this->address,				
					) 
	 			);
	 			
	 			//get the letter_id just created to pass to the select_category view
	 	$this->invoice_id = $wpdb->insert_id;
		
	
	}
	
	public function getInvoices($patient_id){ 
		global $wpdb;
		$query=sprintf('SELECT * from table_invoices WHERE patient_id = "%s" ORDER BY invoice_id DESC',$patient_id);
		$invoices=$wpdb->get_results($query);
		return  $invoices;
	
	}
	
	public function deleteInvoice($invoice_id){
		global $wpdb;
		$wpdb->delete( 'table_invoices', array( 'invoice_id' => $invoice_id ));
	}
	
	public function addInvoiceItem() {
		global $wpdb;
		$wpdb->insert( 
				'table_invoice_items', 
				array( 
					'invoice_id' => $this->invoice_id,
					'item_description' => $this->item_description, 
					'item_price' => $this->item_price,
					'payment_id' => $this->payment_id
									
					) 
	 			);
	 	$this->invoice_item_id = $wpdb->insert_id;
		
	}
	
	public function updateInvoiceTotal($invoice_id,$total)
	{
		global $wpdb;
		$wpdb->update( 
		'table_invoices', 
		array( 
			'total' => $total,
			), 
		array( 'invoice_id' => $invoice_id) 
		 
		);
	}
	
	public function getInvoiceItems($invoice_id){
		global $wpdb;
		$query=sprintf('SELECT * from table_invoice_items WHERE invoice_id = "%s"',$invoice_id);
		$invoice_items=$wpdb->get_results($query);
		return  $invoice_items;
		
	}	
	
	public function deleteInvoiceItem($invoice_item_id){
		global $wpdb;
		$wpdb->delete( 'table_invoice_items', array( 'invoice_item_id' => $invoice_item_id ));	
	}
	
	public function getInvoiceHeading($clinic_id){
		global $wpdb;
		$query= sprintf('SELECT clinic_invoice_heading from table_clinics WHERE clinic_id = "%s"',$clinic_id);
		$invoice_heading = $wpdb->get_row($query);
		return $invoice_heading;
	}
	
	public function saveInvoice($id,$note){
		global $wpdb;
		$wpdb->update( 
		'table_invoices', 
		array( 
			'note' => $note,
			), 
		array( 'invoice_id' => $id) 
		 
		);
	}
}

?>