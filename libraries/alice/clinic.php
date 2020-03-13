<?php
class Clinic {

public function getClinics($user) {
	//get all the clinics a user is affiliated to and the services... 
	
    global $wpdb;
	$query = $wpdb->prepare('SELECT * from view_clinics_active_users WHERE user_id = %d', $user);
	$clinics=$wpdb->get_results($query);
	
	
	foreach ($clinics as &$clinic) {
		$query = $wpdb->prepare ('SELECT * from table_services WHERE clinic = %d',$clinic->clinic_id);
		$services = $wpdb->get_results($query);
		$clinic->{"services"} = $services;
		
	}
	
	unset($clinic); //break the reference with the last element in case we need loop again
	return $clinics;
    
}

public static function getClinic($clinic_id) {
	global $wpdb;
	//get clinic object
	$query= sprintf('SELECT * from table_clinics WHERE clinic_id = %d',$clinic_id); 
	$clinic = $wpdb->get_row($query);
	
	return $clinic;
	}
	
public function getClinicGroupID($clinic_id) {
	global $wpdb;
	//get clinic object
	$query= sprintf('SELECT table_clinics.group from table_clinics WHERE clinic_id = %d',$clinic_id);
	$groupID = $wpdb->get_var($query);
	return $groupID;
}

	
	
public function getClinicsFromGroup($groupName){
	global $wpdb;
	$query = $wpdb->prepare('
		SELECT 
		
		table_clinics.clinic_name,
		table_clinics.clinic_id,

		table_group.name as groupname,
		table_group.group_id

		FROM `table_clinics`
		INNER JOIN table_group
		ON table_clinics.group = table_group.group_id

		WHERE table_group.name = %s',$groupName);
	$clinics=$wpdb->get_results($query);
	return  $clinics;
	}

public function getPractitionersFromClinic($clinic) {
	global $wpdb;
	//get all user id's active in clinic
 	$query = $wpdb->prepare('SELECT user_id FROM table_clinic_user WHERE clinic_id=%d AND active=1', $clinic);
	$users = $wpdb->get_results($query);
	
	$arrayUserIDS = array();
	foreach ($users as $user) {
			array_push($arrayUserIDS,$user->user_id);
			//error_log($user->user_id);	
			
		}
		error_log(print_r($arrayUserIDS,true));
	//get all user details

	$args = array(
		    'role__in'       => array('practitioner','clinic_admin'),
			'include'        => $arrayUserIDS,
			'order'          => 'ASC',
			'orderby'        => 'display_name',
			//'fields'         => 'all_with_meta',
		);
	
	
	// The User Query
	error_log(print_r($args,1));
	$user_query = new WP_User_Query( $args );
	return $user_query->results;
	
	}

}



?>