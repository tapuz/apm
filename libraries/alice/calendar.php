<?php

class Calendar {
    
	public function getAppointments($userID,$start,$end){
		//get the reg appts
		global $wpdb;
		$query = $wpdb->prepare("SELECT * from view_appointments WHERE (resourceId = '%d' AND start > DATE_ADD('%s', INTERVAL -3 DAY) AND end < DATE_ADD('%s', INTERVAL +3 DAY))",$userID,$start,$end);
		$appointments = $wpdb->get_results($query);
		
		//get the custom appts
		$query = $wpdb->prepare("SELECT appointment_id as id, start,end, user as resourceId, customAppointment, note as title, note, '#9fa1a3' AS 'color' from table_appointments WHERE (customAppointment = 1 AND user = '%d' AND start > DATE_ADD('%s', INTERVAL -3 DAY) AND end < DATE_ADD('%s', INTERVAL +3 DAY))",$userID,$start,$end);
		$custom_appointments = $wpdb->get_results($query);
		//error_log(print_r(array_merge($appointments,$custom_appointments),1));

		//get the extra working timeslots
		$query = $wpdb->prepare("
			SELECT table_custom_timeslots.id, 
			table_custom_timeslots.start,table_custom_timeslots.end, 
			table_custom_timeslots.user as resourceId,
			table_custom_timeslots.clinic,
			'1' as 'customTimeslot',
			table_services.color,
			table_clinics.clinic_name as title,
			'background' as 'rendering'
			FROM table_custom_timeslots 
			INNER JOIN table_services
			ON table_services.id = table_custom_timeslots.service
			INNER JOIN table_clinics
			ON table_custom_timeslots.clinic = table_clinics.clinic_id
			WHERE (user = '%d' AND start > DATE_ADD('%s', INTERVAL -3 DAY) AND end < DATE_ADD('%s', INTERVAL +3 DAY))",$userID,$start,$end);
		$customTimeslots = $wpdb->get_results($query);


		return array_merge($appointments,$custom_appointments,$customTimeslots);

	}
	
	public static function getAppointmentsForToday($userID){
		global $wpdb;
		
		$query = $wpdb->prepare("SELECT * FROM `view_appointments` WHERE DATE(start) = CURDATE() AND resourceId=%d",$userID);
		

		
		$appointments = $wpdb->get_results($query);
		//return  $appointments;
		return $wpdb->num_rows;
	}

	public static function getAppointmentsThisWeek($userID){
		global $wpdb;
		$query = $wpdb->prepare("SELECT * FROM `view_appointments` WHERE YEARWEEK(start) = YEARWEEK(CURDATE()) AND resourceId='%d'",$userID);
		$appointments = $wpdb->get_results($query);
		return  $appointments;
		
		
	} 

	public static function getAppointmentsNextWeek($userID){
		global $wpdb;
		$query = $wpdb->prepare("SELECT * FROM `view_appointments` WHERE YEARWEEK(start) = YEARWEEK(CURDATE())+1 AND resourceId='%d'",$userID);
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

	public static function getAppointment($id){
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
            table_appointments.madeOnline,
			table_appointments.payed,
            
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
		$query = $wpdb->prepare("SELECT appointment_id as id,user as resourceId ,start,end, customAppointment, note as title, note, '#9fa1a3' AS 'color' from table_appointments WHERE appointment_id=%d",$id);
		$customAppointment = $wpdb->get_row($query);
		return $customAppointment;
  	}
	
	public static function getCustomTimeslot($id){
        global $wpdb;
        $query=sprintf("
            SELECT
            table_custom_timeslots.id,
            table_custom_timeslots.user as resourceId,
            table_custom_timeslots.start,
            table_custom_timeslots.end,
			table_custom_timeslots.clinic,
			table_custom_timeslots.service as serviceId,
			'1' as 'customTimeslot',
            
			table_clinics.clinic_name as title,

			table_services.color as backgroundColor,
			table_services.color as borderColor,
			'background' as 'rendering'
			
            FROM table_custom_timeslots            
			INNER JOIN table_services
			ON table_custom_timeslots.service = table_services.id

			INNER JOIN table_clinics
			ON table_custom_timeslots.clinic = table_clinics.clinic_id
			
            WHERE (table_custom_timeslots.id = '%s')"
                ,$id);
        
        $timeslot = $wpdb->get_row($query);
        return  $timeslot;
    }

	public static function getCustomTimeslots($user, $currentDate){
		global $wpdb;
		$query = $wpdb->prepare("
			SELECT table_custom_timeslots.id, 
			table_custom_timeslots.start,table_custom_timeslots.end, 
			table_custom_timeslots.user as resourceId,
			table_custom_timeslots.clinic,
			'1' as 'customTimeslot',
			table_services.color,
			table_clinics.clinic_name as title,
			'background' as 'rendering'
			FROM table_custom_timeslots 
			INNER JOIN table_services
			ON table_services.id = table_custom_timeslots.service
			INNER JOIN table_clinics
			ON table_custom_timeslots.clinic = table_clinics.clinic_id
			WHERE (user = '%s' AND WEEKOFYEAR(start) = WEEKOFYEAR('%s') AND YEARWEEK(start, 1) = YEARWEEK('%s', 1))",$user,$currentDate,$currentDate);
			
		$customTimeslots = $wpdb->get_results($query);
		return $customTimeslots;
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
					'note' => $app->note,
					'madeOnline' => $app->madeOnline
					) 
	 			);
	 			
        //return newly created appointment
		$id=$wpdb->insert_id;
		return self::getAppointment($id);
	 	
    }

	
	public static function addCustomTimeslot($timeslot) {
        global $wpdb;
		$slot = $timeslot;
		$wpdb->insert( 
				'table_custom_timeslots', 
				array( 
					'user' => $slot->userID, 
					'clinic' => $slot->clinic,
					'start' => $slot->start,
					'end' => $slot->end,
					'service'=> $slot->service
					) 
	 			);
	 			
        //return newly created CustomAppointmentappointment
		$id=$wpdb->insert_id;
		return self::getCustomTimeslot($id);
	 	
    }


	public static function addCustomAppointment($appointment) {
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

	public static function addToWaitinglist($demand) {
        global $wpdb;
		//$app = $appointment;
		$wpdb->insert( 
				'table_waitinglist', 
				array( 
					'patient_id' => $demand->patient->patient_id,
					'patient_surname' => $demand->patient->patient_surname, 
					'patient_firstname' => $demand->patient->patient_firstname,
					'dob' => $demand->patient->dob,
					'email' => $demand->patient->email,
					'phone' => $demand->patient->phone,
					'group' => $demand->group,
					'clinic' => $demand->clinic,
					'practitioner' => $demand->userID,
					'note' => $demand->note,
					'severity' => $demand->severity,
					'service'=> $demand->service,
					) 
	 			);
	 			
        //return newly created appointment
		$id=$wpdb->insert_id;
		return self::getWaitinglistItem($id);
	 	
    }

	public static function getWaitinglistItem($id){
		global $wpdb;
		$query = $wpdb->prepare("
			SELECT
			table_waitinglist.*,
			wp_users.display_name as resourceName,
			
			table_services.id as serviceId,
			
			
			table_services.id as serviceId,
			table_services.color as backgroundColor,
			table_services.color as borderColor,
			table_services.duration as duration,
			table_services.description
			
			FROM table_waitinglist
		
			INNER JOIN wp_users
			ON table_waitinglist.practitioner = wp_users.ID
			INNER JOIN table_services
			ON table_waitinglist.service = table_services.id

			WHERE table_waitinglist.id = %d
			
			
			",$id);
		$item = $wpdb->get_row($query);
		return $item;
  	}

	public static function getWaitinglist($group){
		global $wpdb;
		$query = $wpdb->prepare("
			SELECT
			table_waitinglist.*,
			wp_users.display_name as resourceName,
			
			table_services.id as serviceId,
			
			
			table_services.id as serviceId,
			table_services.color as backgroundColor,
			table_services.color as borderColor,
			table_services.duration as duration
			
			FROM table_waitinglist
		
			INNER JOIN wp_users
			ON table_waitinglist.practitioner = wp_users.ID
			INNER JOIN table_services
			ON table_waitinglist.service = table_services.id

			WHERE table_waitinglist.group = %d",
			$group);
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

	public static function setPayed($appointmentID,$payment){
		global $wpdb;
		$query = sprintf("UPDATE table_appointments SET payed = %s where appointment_id = %s",$payment,$appointmentID);
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
	
	
	
	
	
	public function getLog($appointment_id,$tag){
		global $wpdb;

		if ($tag=='all'){

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
		} else {
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
				
				WHERE table_appointments_log.appointment_id = '%s' AND tag='%s' ORDER BY table_appointments_log.id DESC",$appointment_id,$tag);
		}
		return $wpdb->get_results($query);
	}
	
	public static function getUserAvailableTimeslots($user,$clinic,$selected_date,$service_duration,$timing,$min_delta_to_first_timeslot,$service){
		loadLib('service');	
		$extra_booking = [
			    //['start' => '18:00', 'end' => '19:00'],
			];				
		error_log('THE date == ' . $selected_date);
		
		$day = strtolower(date('l', strtotime($selected_date))); //ex 'monday'
		//clinic_id is not needed in the query.. if included, custom appts are excluded.. they do not have a clinic_id
		$q = sprintf("select * from table_appointments where user = %d AND DATE(start) = '%s' AND status != 6 AND (clinic='%s' OR clinic='0') ORDER BY start ASC",$user,$selected_date,$clinic);
		global $wpdb;
		$appointments=$wpdb->get_results($q);
		
		$q =$wpdb->prepare("select TIME(start) as start ,TIME(end) as end from table_custom_timeslots where user = %d AND DATE(start) = '%s' AND clinic='%s' AND service='%s' ORDER BY start ASC",$user,$selected_date,$clinic,$service);
		$customWorkingPlan = $wpdb->get_results($q, ARRAY_A);
		
		
		error_log(print_r($customWorkingPlan,1));
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
	
		if (Service::customTimeslotOnly($service)) {
			$available_periods_with_breaks = $customWorkingPlan;
			//error_log(print_r($available_periods_with_breaks,1));
		} else {
					$working_plan_all = json_decode(get_user_meta( $user, 'working_plan',1),TRUE);
					//error_log('working plan for user-->' . print_r($working_plan_all,1));
					

					//search the working_plan_all for the working plan according to the clinic
					$working_plan_temp = null;
					$working_plan = null;
					
				foreach($working_plan_all as $working_plan_clinic) {
					//error_log('clinic ID ' . $working_plan_clinic['clinic'] );
					if ($clinic == $working_plan_clinic['clinic']) {
						$working_plan_temp = $working_plan_clinic;
						$working_plan = $working_plan_clinic['workingPlan'];
						break;
					}
				}
				//error_log('working plan temp for the selected clinic-->' . print_r($working_plan,1));

					$working_plan = $working_plan[0];
					if (!array_key_exists($day, $working_plan)) {
						// there is no working plan for this day, return FALSE
						return FALSE;
					}
					//error_log($day . 'does exits');
					$selected_date_working_plan = $working_plan[$day];
				
					$available_periods_with_breaks = array();
					
					if (isset($selected_date_working_plan['breaks'])) {
						$start = new DateTime($selected_date_working_plan['start']);
						$end = new DateTime($selected_date_working_plan['end']);
						$available_periods_with_breaks[] = array(
							'start' => $selected_date_working_plan['start'],
							'end' => $selected_date_working_plan['end']
						);
						//error_log('DAY ' . $selected_date);
						
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
					

					
				
					error_log("AVAILABLE PERIODS WITHOUT APPOINTMENTS----->");
					error_log(print_r($available_periods_with_breaks,1));
				}	
		
		//combine appointments and breaks
		
		 $available_periods_with_appointments = $available_periods_with_breaks;
	    //error_log("AVAILABLE PERIODS WITHOUT APPOINTMENTS----->");
		//error_log(print_r($available_periods_with_breaks,1));			

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
	    //error_log('VOILA');
	    //error_log(print_r($available_periods_with_appointments,1));
	    
	    //$periods = array_merge($available_periods_with_appointments, $extra_booking);
		$periods = array_merge($available_periods_with_appointments, $customWorkingPlan);
		//error_log('VOILA the merged');
	    //error_log(print_r($periods,1));
		


	    $merged = [];
		
		    // Sort the periods by their start times
		    usort($periods, function ($a, $b) {
		        return strtotime($a['start']) - strtotime($b['start']);
		    });
			
		
		    $currentPeriod = null;
		     //took this part out because it deletes certain periods....not sure why but seems to work ok without
		     /* foreach ($periods as $period) {
		        if ($currentPeriod === null || strtotime($period['start']) > strtotime($currentPeriod['end'])) {
		            // If there's no overlap, add the current period to the merged array
		            $merged[] = $period;
		            $currentPeriod = $period;
		        } else {
		            // If there's an overlap, merge the current period with the new period
		            $currentPeriod['end'] = max($currentPeriod['end'], $period['end']);
		        }
		    }  */
	    
	    	
			//print_r($available_periods_with_extra_booking);	
			
	    $available_periods_with_appointments = $periods;
	    
	    asort($available_periods_with_appointments);
		//error_log('AVAL SLOTS ' .  print_r(array_values($available_periods_with_appointments),1));
		//error_log('AVAL SLOTS ' .  print_r(array_values($available_periods_with_appointments),1));
		// unset all timeslots that do not fit the required time
		// 
		$timeslots_to_propose = array();
		$prev_timeslot_end = NULL;
		foreach($available_periods_with_appointments as $slot){
			//echo 'delta is : ' . $since_start->i . PHP_EOL;
			
			$start = strtotime($slot['start']);

			//error_log('THIS IS THE START '  . date('d-m-Y H:i:s',$start));
			//error_log('THIS IS THE TIME NOW ' . date('d-m-Y H:i:s'));
		


			$end = strtotime($slot['end']);
			$delta = ($end - $start)/60;
			
			if(isset($prev_timeslot_end) AND ($start < ($prev_timeslot_end + (30*60)) )){
				//error_log('THIS IS THE START '  . date('H:i:s',$start));
				//error_log('PREV SLOT END '  . date('H:i:s',$prev_timeslot_end));
				//if previous proposed timeslot is to close to next slot.. skip

				//continue;
			}
			//$prev_timeslot_end = $end;
			//$prev_timeslot_end = NULL;
			
			//echo 'start : ' . $start . ' - ' . $slot['start'] . PHP_EOL;
			//echo 'end : ' . $end . ' - ' . $slot['end'] .PHP_EOL;
			//echo 'the delta is ' . ($end - $start)/60 .PHP_EOL;
			//echo '----------------------------------------' . PHP_EOL;
			
			if ($delta < $service_duration ){
				//error_log('THIS IS THE START '  . date('H:i:s',$start));
				//error_log('NOT ENOUGH TIME');
				//error_log('delta is : ' . $delta);
				//cant use this timeslot because there is not enough time
				//unset ($available_periods_with_appointments[$key]);
				$prev_timeslot_end = $end;
			} else if ($delta == $service_duration){
				//$timeslots_to_propose[] = $period;
				//we can use this timeslot as it is and give it priority 1 because this will fill up a gap
				
				$timeslots_to_propose[] = array(
					        'priority' => 1,
							'user' => $user,
							'clinic' => $clinic,
						    'start' => $selected_date . 'T' . date('H:i', $start),
						    'end' => $selected_date . 'T' . date('H:i', $end));
				$prev_timeslot_end = $end;
			} else if ($delta > $service_duration){
				//we can use this timeslot... lets split it into smaller ones
				//give the first one one priority as this will be closer to an existing appointment or break
				$prev_timeslot_end_ = NULL;	
				for( $i = $start; $i <= $end; $i += (60*$service_duration)) 
				{
					
					//if ($i<time()){continue;}
					$s = $start;
					$e = $i + (60*$service_duration);
					if($e <= $end){
						
						
						
						do {					
							if ($i == $start){//timeslot is at the beginning of a period
								$priority = 1;
								break;
							} elseif ($e == $end) {//timeslot is at the end of a period
								$priority = 1;
								break;
							} elseif (isset($prev_timeslot_end_) AND ($i < ($prev_timeslot_end_ + (60*60)) )){
								//error_log('THIS IS THE START '  . date('d-m-Y H:i:s',$start));
							    
								$priority = 3;
								break;
								
							
							} else {
								$priority = 2; //timeslot is somewhere in the middle of a period
							}
						
						}while (0); 
						
						if (time() + ($min_delta_to_first_timeslot*60) > strtotime($selected_date . ' ' . date('H:i', $i))){
							continue;
						}
						$timeslots_to_propose[] = array(
							'priority' => $priority,
							'user' => $user,
							'clinic' => $clinic,
						    'start' => $selected_date . 'T' . date('H:i', $i),
						    'end' => $selected_date . 'T' . date('H:i', $i + (60*$service_duration))
						);
						if ($priority==3){
							$prev_timeslot_end = NULL;
						}else{
							$prev_timeslot_end_ = $e;
						}
					    

						
						
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
