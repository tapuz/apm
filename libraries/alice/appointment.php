<?php
class Appointment


{
	public function getAppointments($patient_id){
	global $wpdb;
	$query=sprintf('SELECT * from view_appointments WHERE patientID = "%s" AND status <> 7 ORDER BY scheduled_date DESC',$patient_id);
	$appointments=$wpdb->get_results($query);
	return $appointments;
	}
	
	
}
?>