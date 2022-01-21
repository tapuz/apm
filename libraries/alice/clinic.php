<?php
class Clinic {

	public static function updateClinic($clinic){
		global $wpdb;
		$array = array();
		foreach ($clinic as $value) {
			$array[$value["name"]] = $value["value"];

		}
		$wpdb->update( 
				'table_clinics',$array ,
				array( 'clinic_id' => $array['clinic_id'])
	 	);

		//return self::getPatient($patient_id);
		
		
	}

public static function getClinics($user) {
	//get all the clinics a user is affiliated to and the services... 
	
    global $wpdb;
	$query = $wpdb->prepare('SELECT 
		view_clinics_active_users.group,
		view_clinics_active_users.user_id,

		table_clinics.*

		from view_clinics_active_users 
		INNER JOIN table_clinics
		ON table_clinics.clinic_id = view_clinics_active_users.clinic_id
		WHERE user_id = %d', $user);
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
	
public static function getClinicGroupID($clinic_id) {
	global $wpdb;
	//get clinic object
	$query= sprintf('SELECT table_clinics.group from table_clinics WHERE clinic_id = %d',$clinic_id);
	$groupID = $wpdb->get_var($query);
	return $groupID;
}

	
	
public static function getClinicsFromGroup($groupName){
	global $wpdb;
	$query = $wpdb->prepare('
		SELECT 
		
		table_clinics.clinic_name,
		table_clinics.clinic_id,
		table_clinics.clinic_url,

		table_group.name as groupname,
		table_group.description,
		table_group.group_id,
		table_group.logo

		FROM `table_clinics`
		INNER JOIN table_group
		ON table_clinics.group = table_group.group_id

		WHERE table_group.name = %s',$groupName);
	$clinics=$wpdb->get_results($query);
	return  $clinics;
	}

public static function getPractitionersFromClinic($clinic) {
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
			'fields'         => array("ID", "user_nicename", "display_name"),
		);
	
	
	// The User Query
	error_log(print_r($args,1));
	$user_query = new WP_User_Query( $args );
	return $user_query->results;

	}

}



?>