<?php

class Calendar {
    
	public function getAppointments($userID,$start,$end){
		global $wpdb;
		$query = $wpdb->prepare("SELECT * from view_appointments WHERE (resourceId = '%d' AND start > DATE_ADD('%s', INTERVAL -3 DAY) AND end < DATE_ADD('%s', INTERVAL +3 DAY))",$userID,$start,$end);
		$appointments = $wpdb->get_results($query);
		
		
		$query = $wpdb->prepare("SELECT appointment_id as id, start,end, user as resourceId, customAppointment, note as title, note, '#9fa1a3' AS 'color' from table_appointments WHERE (customAppointment = 1 AND user = '%d' AND start > DATE_ADD('%s', INTERVAL -3 DAY) AND end < DATE_ADD('%s', INTERVAL +3 DAY))",$userID,$start,$end);
		$custom_appointments = $wpdb->get_results($query);
		//error_log(print_r(array_merge($appointments,$custom_appointments),1));
		return array_merge($appointments,$custom_appointments);

	}
	
	public static function getAppointmentsForToday($userID){
		global $wpdb;
		
		$query = $wpdb->prepare("SELECT `patientName` , DATE_FORMAT(start , '%Y-%m-%d' ) FROM `view_appointments` WHERE DATE_FORMAT (start , '%Y-%m-%d' ) = CURDATE( ) AND resourceId=%d",$userID);
		
		$appointments = $wpdb->get_results($query);
		//return  $appointments;
		return $wpdb->num_rows;
	}

	public static function getAppointmentsThisWeek($userID){
		global $wpdb;
		$query = $wpdb->prepare("SELECT * FROM `view_appointments` WHERE YEARWEEK(start)=YEARWEEK(NOW()) AND resourceId='%d'",$userID);
		$appointments = $wpdb->get_results($query);
		return  $appointments;
		
		
	} 

	


	

	public static function getFutureAppointments($patientID){
		global $wpdb;
		$query = $wpdb->prepare("SELECT *,DATE_FORMAT(start, '%%a, %%e %%M %%Y - %%H:%%i') as strStart FROM view_appointments WHERE (patientID = %d AND start > CURRENT_DATE)",$patientID);
		$appointments = $wpdb->get_results($query);
		return  $appointments;
	}

	public static function getLastAppointment($patientID){
		global $wpdb;
		$query = $wpdb->prepare("SELECT *,DATE_FORMAT(start, '%%a, %%e %%M %%Y - %%H:%%i') as strStart FROM view_appointments WHERE (patientID = %d AND start < CURRENT_DATE) ORDER BY start DESC LIMIT 1",$patientID);
		$appointments = $wpdb->get_results($query);
		return  $appointments;
	}
    

	public static function getAppointment_($id){
		global $wpdb;
		$query = $wpdb->prepare("SELECT * from view_appointments WHERE id = %d",$userID);
		$appointments = $wpdb->get_row($query);
	    return  $appointment;
	}

	public function getAppointment($id){
        global $wpdb;
        $query=sprintf("
            SELECT
            table_appointments.appointment_id as id,
            table_appointments.user as resourceId,
            table_appointments.start,
            table_appointments.end,
            table_appointments.patient_id as patientID,
			table_appointments.status as status,
			table_appointments.clinic,
			table_appointments.note,
			table_appointments.customAppointment,
            
            CONCAT(table_patients.patient_surname, ' ', table_patients.patient_firstname) as title,
            CONCAT(table_patients.patient_surname, ' ', table_patients.patient_firstname) as patientName,
			
			table_patients.patient_firstname, 
			table_patients.phone,
			table_patients.email,
			table_patients.dob,
            
			wp_users.display_name as resourceName,
			
			table_services.id as serviceId,
			table_services.color as backgroundColor,
			table_services.color as borderColor
			
            FROM table_appointments
            INNER JOIN table_patients
            ON table_appointments.patient_id = table_patients.patient_id
			INNER JOIN wp_users
			ON table_appointments.user = wp_users.ID
			INNER JOIN table_services
			ON table_appointments.service = table_services.id
			
            WHERE (table_appointments.appointment_id = '%s')"
                ,$id);
        
        $appointment = $wpdb->get_row($query);
        return  $appointment;
    }

	public static function getCustomAppointment($id){
		global $wpdb;
		$query = $wpdb->prepare("SELECT appointment_id as id, start,end, customAppointment, note as title, note, '#9fa1a3' AS 'color' from table_appointments WHERE appointment_id=%d",$id);
		$customAppointment = $wpdb->get_row($query);
		return $customAppointment;
  	}
	
	public static function addAppointment($appointment) {
        global $wpdb;
		$app = $appointment;
		$wpdb->insert( 
				'table_appointments', 
				array( 
					'user' => $app->userID, 
					'patient_id' => $app->patientID,
					'start' => $app->start,
					'end' => $app->end,
					'status' => $app->status,
					'service' => $app->service,
					'clinic' => $app->clinic,
					'customAppointment' => 0,
					'note' => $app->note
					) 
	 			);
	 			
        //return newly created appointment
		$id=$wpdb->insert_id;
		return self::getAppointment($id);
	 	
    }

	public function addCustomAppointment($appointment) {
        global $wpdb;
		$app = $appointment;
		$wpdb->insert( 
				'table_appointments', 
				array( 
					'user' => $app->userID, 
					'start' => $app->start,
					'end' => $app->end,
					'note' => $app->note,
					'customAppointment' => 1
					) 
	 			);
	 			
        //return newly created CustomAppointmentappointment
		$id=$wpdb->insert_id;
		return self::getCustomAppointment($id);
	 	
    }
	
	
	public function getAppointmentRequests($group){ //not used
		global $wpdb;
		$query = $wpdb->prepare("
			SELECT
				table_appointment_requests.patient as patientID,
				table_appointment_requests.clinic,
				table_appointment_requests.user,
				table_appointment_requests.timing,
				table_appointment_requests.comment,
				
				CONCAT(table_patients.patient_surname, ' ', table_patients.patient_firstname) as title,
				CONCAT(table_patients.patient_surname, ' ', table_patients.patient_firstname) as patientName
				
				
			from table_appointment_requests
			INNER JOIN table_patients
			ON table_appointment_requests.patient = table_patients.patient_id
			WHERE table_appointment_requests.group = %d",
			$group);
		$result=$wpdb->get_results($query);
		return $result;
	}
	
	public static function deleteAppointment($id){
		global $wpdb;
		$wpdb->delete( 'table_appointments', array( 'appointment_id' => $id ) );
	}

	public static function updateCustomAppointment($appointment){
		$appointment = json_decode($appointment);
		error_log('updating custom !!');
		global $wpdb;
		$wpdb->update( 
				'table_appointments', 
				array( 
					'start' => $appointment->start, 
					'end' => $appointment->end, 
					'user' => $appointment->user
					),
				array( 'appointment_id' => $appointment->id)
	 			);
		
				 error_log(print_r( self::getAppointment($appointment->id)),1);		
	}


	public static function updateAppointment($appointment){
		$appointment = json_decode($appointment);
		//error_log($appointment->service . ' :service');
		global $wpdb;
		$wpdb->update( 
				'table_appointments', 
				array( 
					'start' => $appointment->start, 
					'end' => $appointment->end, 
					'user' => $appointment->user,
					'patient_id' => $appointment->patientID,
					'status' => $appointment->status,
					'service' => $appointment->service,
					'clinic' => $appointment->clinic,
					'note' => $appointment->note
					),
				array( 'appointment_id' => $appointment->id)
	 			);
		return self::getAppointment($appointment->id);
	}
	
	public static function setStatus($appointmentID,$status){
		global $wpdb;
		$query = sprintf("UPDATE table_appointments SET status = %s where appointment_id = %s",$status,$appointmentID);
		$wpdb->query($query);
	
	}
	
	public function addAppointmentLog($appointment_id,$datetime,$tag,$log,$labelclass) {
		//get current user ID
		
		
		global $wpdb;
		$wpdb->insert( 
				'table_appointments_log', 
				array( 
					'appointment_id' => $appointment_id, 
					'datetime' => $datetime,
					'tag' => $tag,
					'log' => $log,
					'labelclass' => $labelclass,
					'user' => get_current_user_id()
					) 
	 			);
		
	}
	
	
	
	
	
	public function getLog($appointment_id){
		global $wpdb;
		$query = sprintf(
						 "SELECT table_appointments_log.appointment_id,
								 table_appointments_log.datetime,
								 table_appointments_log.labelclass,
								 table_appointments_log.log,
								 table_appointments_log.tag,
						 
								 wp_users.display_name as username
						 
						 FROM table_appointments_log
						 INNER JOIN wp_users
						 ON table_appointments_log.user = wp_users.ID
						 
						 WHERE table_appointments_log.appointment_id = '%s' ORDER BY table_appointments_log.id DESC",$appointment_id);
		return $wpdb->get_results($query);
	}
	
	public static function getUserAvailableTimeslots($user,$clinic,$selected_date,$service_duration,$timing){
		$day = strtolower(date('l', strtotime($selected_date))); //ex 'monday'
		//clinic_id is not needed in the query.. if included, custom appts are excluded.. they do not have a clinic_id
		$q = sprintf("select * from table_appointments where user = %d AND DATE(start) = '%s' ORDER BY start ASC",$user,$selected_date);
		global $wpdb;
		
		$appointments=$wpdb->get_results($q);
		
		//add periods not possible for patient for this day as appointments so that these periods are not included possible timeslots
		
		$timing = json_decode(stripslashes($timing));
		//error_log($timing);
		
		//filter the timing for the day
		if (!empty($timing)){ //if empty the user did not select any periods that do not suit him
			foreach($timing as $index => $item) {
				if ($item->day != $day) {
					unset($timing[$index]);
				} else {
					$item->start = $selected_date . ' ' . $item->start;
					$item->end = $selected_date . ' ' . $item->end;
					$appointments[] = $item;
					
				}
			}
			
		}
		
		//error_log($timing_entries_for_day);
		//error_log('PATIENT TIMING->>'. print_r($timing,1));
		///error_log('PATIENT TIMING->>'. print_r($appointments,1));
		
		
		
		//echo PHP_EOL . print_r($appointments,1);
		
		$working_plan_all = json_decode(get_user_meta( $user, 'working_plan',1),TRUE);
		//error_log('working plan for user-->' . print_r($working_plan_all,1));
		

		//search the working_plan_all for the working plan according to the clinic
		$working_plan_temp = null;
		$working_plan = null;
		
	foreach($working_plan_all as $working_plan_clinic) {
		error_log('clinic ID ' . $working_plan_clinic['clinic'] );
    	if ($clinic == $working_plan_clinic['clinic']) {
			$working_plan_temp = $working_plan_clinic;
			$working_plan = $working_plan_clinic['workingPlan'];
        	break;
    	}
	}
	error_log('working plan temp for the selected clinic-->' . print_r($working_plan,1));

		$working_plan = $working_plan[0];
		if (!array_key_exists($day, $working_plan)) {
			// there is no working plan for this day, return FALSE
			error_log('this is the day ' .$day . ' and does not exists');
			return FALSE;
		}
		error_log($day . 'does exits');
		$selected_date_working_plan = $working_plan[$day];
	   
		$available_periods_with_breaks = array();
	    if (isset($selected_date_working_plan['breaks'])) {
	        $start = new DateTime($selected_date_working_plan['start']);
	        $end = new DateTime($selected_date_working_plan['end']);
	        $available_periods_with_breaks[] = array(
	            'start' => $selected_date_working_plan['start'],
	            'end' => $selected_date_working_plan['end']
	        );
	        // Split the working plan to available time periods that do not contain the breaks in them.
	        foreach ($selected_date_working_plan['breaks'] as $index => $break) {
	            $break_start = new DateTime($break['start']);
	            $break_end = new DateTime($break['end']);
				if ($break_start < $start) {
	                $break_start = $start;
				}
	            if ($break_end > $end) {
	                $break_end = $end;
 				}
	            if ($break_start >= $break_end) {
					continue;
				}
	            foreach ($available_periods_with_breaks as $key => $open_period) {
	                $s = new DateTime($open_period['start']);
	                $e = new DateTime($open_period['end']);
	                if ($s < $break_end && $break_start < $e) { // check for overlap
	                    $changed = FALSE;
	                    if ($s < $break_start) {
	                        $open_start = $s;
	                        $open_end = $break_start;
	                        $available_periods_with_breaks[] = array(
	                            'start' => $open_start->format("H:i"),
	                            'end' => $open_end->format("H:i")
	                        );
	                        $changed = TRUE;
	                    }
	                    if ($break_end < $e) {
	                        $open_start = $break_end;
	                        $open_end = $e;
	                        $available_periods_with_breaks[] = array(
	                            'start' => $open_start->format("H:i"),
	                            'end' => $open_end->format("H:i")
	                        );
	                        $changed = TRUE;
	                    }
						if ($changed) {
	                        unset($available_periods_with_breaks[$key]);
	                    }
	                }
	            }
	        }
	    }
		

		
		
		//echo PHP_EOL .  'AVAILABLE PERIODS WITHOUT APPOINTMENTS----->' .  print_r($available_periods_with_breaks,1);		
		
		//combine appointments and breaks
		
		 $available_periods_with_appointments = $available_periods_with_breaks;
	    foreach($appointments as $appointment) {
	        foreach($available_periods_with_appointments as $index => &$period) {
	            $a_start = strtotime($appointment->start);
	            $a_end =  strtotime($appointment->end);
	            $p_start = strtotime($selected_date .  ' ' . $period['start']);
	            $p_end = strtotime($selected_date .  ' ' .$period['end']);
				if ($a_start <= $p_start && $a_end <= $p_end && $a_end <= $p_start) {
	                // The appointment does not belong in this time period, so we
	                // will not change anything.
	            } else if ($a_start <= $p_start && $a_end <= $p_end && $a_end >= $p_start) {
	                // The appointment starts before the period and finishes somewhere inside.
	                // We will need to break this period and leave the available part.
	                $period['start'] = date('H:i', $a_end);
	            } else if ($a_start >= $p_start && $a_end <= $p_end) {
	                // The appointment is inside the time period, so we will split the period
	                // into two new others.
	                unset($available_periods_with_appointments[$index]);
	                $available_periods_with_appointments[] = array(
	                    'start' => date('H:i', $p_start),
	                    'end' => date('H:i', $a_start)
	                );
	                $available_periods_with_appointments[] = array(
	                    'start' => date('H:i', $a_end),
	                    'end' => date('H:i', $p_end)
	                );
	            } else if ($a_start >= $p_start && $a_end >= $p_start && $a_start <= $p_end) {
	                // The appointment starts in the period and finishes out of it. We will
	                // need to remove the time that is taken from the appointment.
	                $period['end'] = date('H:i', $a_start);
	            } else if ($a_start >= $p_start && $a_end >= $p_end && $a_start >= $p_end) {
	                // The appointment does not belong in the period so do not change anything.
	            } else if ($a_start <= $p_start && $a_end >= $p_end && $a_start <= $p_end) {
	                // The appointment is bigger than the period, so this period needs to be removed.
	                unset($available_periods_with_appointments[$index]);
	            
					
				}
				
				
				
	        }
	    }
	    asort($available_periods_with_appointments);
		//echo PHP_EOL . 'FREE TIMESLOTS SORTED --> ' . print_r(array_values($available_periods_with_appointments),1);
		// unset all timeslots that do not fit the required time
		// 
		$timeslots_to_propose = array();
		//$prev_timeslot_end = 
		foreach($available_periods_with_appointments as $slot){
			//echo 'delta is : ' . $since_start->i . PHP_EOL;
			
			$start = strtotime($slot['start']);
			$end = strtotime($slot['end']);
			$delta = ($end - $start)/60;
			
			if(isset($prev_timeslot_end) AND ($start < ($prev_timeslot_end + (180*60)) )){
				continue;
			}
			
			$prev_timeslot_end = NULL;
			
			//echo 'start : ' . $start . ' - ' . $slot['start'] . PHP_EOL;
			//echo 'end : ' . $end . ' - ' . $slot['end'] .PHP_EOL;
			//echo 'the delta is ' . ($end - $start)/60 .PHP_EOL;
			//echo '----------------------------------------' . PHP_EOL;
			
			if ($delta < $service_duration ){
				//cant use this timeslot because there is not enough time
				//unset ($available_periods_with_appointments[$key]);
			} else if ($delta == $service_duration){
				//$timeslots_to_propose[] = $period;
				//we can use this timeslot as it is and give it priority because this will fill up a gap
				
				$timeslots_to_propose[] = array(
					        'priority' => 1,
							'user' => $user,
							'clinic' => $clinic,
						    'start' => $selected_date . ' ' . date('H:i', $start),
						    'end' => $selected_date . ' ' . date('H:i', $end));
			} else if ($delta > $service_duration){
				//we can use this timeslot... lets split it into smaller ones
				//give the first one one priority as this will be closer to an existing appointment or break
					
				for( $i = $start; $i <= $end; $i += (60*$service_duration)) 
				{
					
					$s = $start;
					$e = $i + (60*$service_duration);
					if($e <= $end){
						
						if(isset($prev_timeslot_end) AND ($i < ($prev_timeslot_end + (180*60)) )){
							continue;
						}
						
					
						if ($i == $start){
							$priority = 2;
						} else if ($e == $end) {
							$priority = 2;
						} else {
							$priority = 3;
						}
						
						$timeslots_to_propose[] = array(
							'priority' => $priority,
							'user' => $user,
							'clinic' => $clinic,
						    'start' => $selected_date . ' ' . date('H:i', $i),
						    'end' => $selected_date . ' ' . date('H:i', $i + (60*$service_duration))
						);
						
						$prev_timeslot_end = $e;
					
					
					}
				} 
				
			}
			
			

			//echo $since_start->i.' minutes<br>';

		}
		
		
		
		//echo PHP_EOL . 'FREE TIMESLOTS---> ' . print_r(array_values($available_periods_with_appointments),1);
		
		
		asort($timeslots_to_propose);
		//echo PHP_EOL . 'TIMESLOTS TO PROPOSE --> ' . print_r(array_values($timeslots_to_propose),1);
		//error_log('TIMESLOTS TO PROPOSE --> ' . print_r(array_values($timeslots_to_propose),1));
		

		if (empty($timeslots_to_propose)){
			return FALSE;
		}else{
			return $timeslots_to_propose;
		
		}
		
		
		
	}
    

}


?>
