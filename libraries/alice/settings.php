<?php
class Settings


{
	public static function tst_func(){
	global $wpdb;
	$query=sprintf('SELECT * from view_treatment_details WHERE patient_id = "%s" AND status <> 7 ORDER BY scheduled_date DESC',$patient_id);
	$appointments=$wpdb->get_results($query);
	return $appointments;
	}
	
	
}
?>