<?php 
//Component Settings
define('COMPONENT','settings');
define('TEMPLATES', ROOT . '/components/com_' . COMPONENT . '/templates/');

loadCSS('settings.css','settings');
loadJS('settings.js','settings');
loadLib('invoice');


switch (getTask()) 
{
	case 'save_template':
		
		$wpdb->update( 
		'table_letter_templates', 
		array( 
			'template' => getVar('template'),
			'name'     => getVar('template_name')
			), 
		array( 'id' => getVar('template_id')) 
		 
		);
		
	break;
	
	case 'delete_template':
		$wpdb->delete( 'table_letter_templates', array( 'id' => getVar('template_id') ));

	break;
	
	case 'add_new_template':
		$wpdb->insert( 
			'table_letter_templates', 
				array( 
					'category_id' => getVar('category_id'),
					'name' => 'New template'				
					) 
	 			);
	 			
	 			//get the letter_id just created to pass to the select_category view
	 	$template_id = $wpdb->insert_id;		
	break;

	case 'save_workingplan':
		$user = get_current_user_id();
		update_user_meta( $user, 'working_plan', getVar('working_plan') );
		
	break;

	case 'update_clinic':
		loadLib('clinic');
		error_log('CLINIC update --> ' . print_r(json_decode(stripslashes(getVar('clinic')),true),1));
		$clinic = json_decode(stripslashes(getVar('clinic')),true);
		Clinic::updateClinic($clinic);
		
	break;

	
	
}

switch (getView()) {
	
	case 'general':
		// display the settings menu
		
	include('views/general.php');
		
	break;

	case 'online_booking':
		loadLib('clinic');
		loadJS('mustache.min.js');
		loadJS('online_booking.js','settings');
		//get the clinics in which the user is working
		//$user = get_current_user_id();
		//$clinics = json_encode(Clinic::getClinics($user));
		include('views/online_booking.php');
		
	
	break;

	case 'clinics':
		loadLib('clinic');
		loadJS('mustache.min.js');
		loadJS('clinics.js','settings');
		//get the clinics in which the user is working
		$user = get_current_user_id();
		$clinics = json_encode(Clinic::getClinics($user));
		include('views/clinics.php');
	
	break;

	case 'working_plan':
		loadCSS('jquery.timepicker.min.css');
		loadJS('jquery.timepicker.min.js');
		loadLib('clinic');
		loadJS('mustache.min.js');
		loadJS('working_plan.js','settings');
	
		//get the clinics in which the user is working
		$user = get_current_user_id();
		$clinics = json_encode(Clinic::getClinics($user));

		$workingPlan = get_user_meta( $user, 'working_plan',1);



		include('views/working_plan.php');
	break;

	case 'select_category':
		// get letter categories to select from
		
		$query="SELECT * from table_letter_categories";
		$categories = $wpdb->get_results($query);
		
		include('views/select_category.php');
	

	break;
	
	case 'templates':
		
		// get category name
		$query = sprintf('SELECT * from table_letter_categories WHERE category_id = %s',$_GET["category_id"]); 
		$category =  $wpdb->get_row($query);
		// get all templates for selected category
		
		$query = sprintf('SELECT * from table_letter_templates WHERE category_id = %s',$_GET["category_id"]); 
		$templates = $wpdb->get_results($query);
		
		include('views/templates.php');
	

	break;
	
	case 'edit_template':
		
		if (getVar('template_id') != NULL) //a call was made from the list view
		{
			$template_id = getVar('template_id');
			
		} // if template_id == NULL -> a call was made from the template view so we have a new template 
		
		// get the template
		
		$query = sprintf('SELECT * from table_letter_templates WHERE id = %s',$template_id); 
		$template = $wpdb->get_row($query);
		
		//get category_id to make back button
		$category_id = getVar('category_id');
		
		
		include('views/edit_template.php');
	

	break;
	
	case 'edit_invoice_heading':
		$invoice_headings = Invoice::getInvoiceHeadings();
		include('views/edit_invoice_heading.php');
	break;
	
	
	
}





?>
