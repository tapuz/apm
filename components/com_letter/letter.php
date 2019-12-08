<?php 
//letter Component

$component_root = $config['root'] . 'components/com_letter/';

loadCSS('letter.css','letter');
loadCSS('print_letter.css','letter');
loadJS('letter.js','letter');
loadLib('clinic');

//patient_info
$patient_id = getVar('patient_id');

$query= sprintf('SELECT * from table_patients WHERE patient_id = "%s"',$patient_id);
//$query= sprintf('SELECT * from table_clinics WHERE clinic_id="2"');
$patient = $wpdb->get_row($query);

$patient_name= $patient->patient_surname .' ' .$patient->patient_firstname;


switch (getVar('task')){
	
	case 'create_new_letter':
		$wpdb->insert( 
				'table_letters', 
				array( 
					'patient_id' => getVar('patient_id'), 
					'user_id' => getVar('user_id'),
					'category_id' => getVar('category_id'),
					'name' => 'new letter',
					'clinic_id' => $patient->clinic
					) 
	 			);
	 			
	 			//get the letter_id just created to pass to the select_category view
	 	$letter_id = $wpdb->insert_id;
	 			
	 			
	break;
	
	case 'delete_letter':
			$wpdb->delete( 'table_letters', array( 'letter_id' => getVar('letter_id') ));
			//the letter was deleted OK return true
	
			echo 'ok';
		
			
	break;
	
	case 'save_letter':
		//prepare the letter html 
		//$letter = _wp_specialchars(getVar('letter'));
		$wpdb->update( 
				'table_letters', 
				array( 
					'name' => getVar('name'), 
					'note' => getVar('note'), 
					'letter' => getVar('letter'),
					'clinic_id' => getVar('clinic_id')
					),
				array( 'letter_id' => getVar('letter_id')) 
		 		
	 			);
	
		
	break;
	
	case 'load_template':
		
		//practitioner info
		$practitioner = get_userdata($patient->practitioner);
		$practitioner_name = $practitioner->user_lastname . ' ' . $practitioner->user_firstname;
		//construct the signature
		
	    $signature_url = $config['signature_path'] . get_user_meta($practitioner->ID,'signature',true) ;
	    $practitioner_signature = sprintf('<img src="%s">',$signature_url); 
		//clinic info
	
		$clinic = Clinic::getClinic(getVar('clinic_id'));
	
	
		
		// get all the vars in the array to inject into the template
		
			$vars = array(
			"date" => date("d/m/Y"),	
				
			"patient_id" => $patient->patient_id,
  			"patient_name" => $patient_name,
  			"patient_dob" => $patient->dob,
  			"patient_address" => $patient->address,
  			"patient_postcode" => $patient->postcode,
  			"patient_city" => $patient->city,
  			"patient_country" => $patient->country,
  			"patient_dob" => $patient->dob,
  			
  			"practitioner_name" => $practitioner_name,
  			"practitioner_signature" => $practitioner_signature,
  			
  			"clinic_name" => $clinic->clinic_name,
  			"clinic_city" => $clinic->clinic_city, 
  			
  			
			);
		
		// get the template
		$query = sprintf('SELECT * from table_letter_templates WHERE id = %s',$_POST["id"]); 
		$template = $wpdb->get_row($query);
		
		
		// inject the values
		foreach ($vars as $key => $value)
		{
  			$template->template = str_replace("{" . $key . "}", $value, $template->template);
		}
		
		
		echo sprintf('<div id="template">%s</div>',$template->template);
		
	break;
}

switch (getVar('view')) {
	
	case 'list':
		// get all the letters that exist for that patient
		$query= sprintf('SELECT * from table_letters WHERE patient_id = "%s" ORDER BY letter_id DESC',getVar('patient_id'));
		$letters = $wpdb->get_results($query);
		$user = get_userdata($patient->practitioner);
		
		$backLink = "index.php?com=patient&view=patient&patient_id=" . $patient_id;
		include('views/list.php');
		
	break;
	
	
	case 'select_category':
		// get letter categories to select from
		
		$query="SELECT * from table_letter_categories";
		$categories = $wpdb->get_results($query);
		$user = get_userdata($patient->practitioner);
		$backLink = "index.php?com=letter&view=list&patient_id=" . $patient_id;
		include('views/select_category.php');
	
	
	break;
	
	case 'edit_letter':
		
		
		if (getVar('letter_id') != NULL) //a call was made from the list view
		{
			$letter_id = getVar('letter_id');
			
		} // if letter_id == NULL -> a call was made from the select_category view so we have a new letter 
		
		$letter = $wpdb->get_row("SELECT * FROM table_letters WHERE letter_id =" . $letter_id);
		
		//decode the letter
		$letter_body = stripslashes($letter->letter);
		
		
		//get the category templates
		$query = sprintf('SELECT * from table_letter_templates WHERE category_id = %s',$letter->category_id); 
		$templates = $wpdb->get_results($query);
		$clinics = Clinic::getClinics(get_current_user_id());
		//$clinic = getClinic($patient->clinic);
		
		$backLink = "index.php?com=letter&view=list&patient_id=" . $patient_id; 
		include('views/edit_letter.php');
		
	break;
	
	case 'ajax':
	break;
	

}








?>
