<?php
class Patient 
{

	public static function setActivePatient($patientID)
	{
		update_user_meta( get_current_user_id(), 'activePatient', $patientID );
	}

	public static function getActivePatient($user)
	{
		//get the activePatientID
		$activePatientID = get_user_meta( $user, 'activePatient',true);
		//get the patient
		return self::getPatient($activePatientID);
		

	}
	
	public function addNewPatient($oPatient,$group){
		
		global $wpdb;
		
		$wpdb->insert( 
				'table_patients', 
				array( 
					'patient_surname' => $oPatient->surname,
					'patient_firstname' => $oPatient->firstname, 
					'dob' => $oPatient->dob,
					'phone' => $oPatient->phone,
					'email' => $oPatient->email,
					'practitioner' => $oPatient->practitioner,
					'clinic' => $oPatient->clinic,
					'group' => $group
					) 
	 			);
		return $wpdb->insert_id;
	}
	
	public function searchPatients__($q,$user){
		
		//create a temp table containing only patients belonging to a group
		global $wpdb;
		
		
		$query = $wpdb->prepare('CREATE TEMPORARY TABLE IF NOT EXISTS temp_table_patients AS
				(SELECT 
				 table_patients.patient_id,
				 table_patients.dob,
				 table_patients.patient_surname,
				 table_patients.patient_firstname,
				 table_patients.phone,
				 table_patients.email,
				 table_patients.clinic,
				 table_patients.practitioner,
			
				 table_group_user.group,
				 table_group_user.user

				 FROM table_patients
				 INNER JOIN table_group_user
				 on table_group_user.group = table_patients.group
				 WHERE table_group_user.user = %d)',$user);
		
		$wpdb->query($query);
		$table_name = 'temp_table_patients';
		if($wpdb->get_var("SHOW TABLES LIKE '$table_name'") != $table_name) {
		//table not in database. Create new table
		error_log('THE TABLE DOES NOT EXIST');
		}else{
		error_log('THE TABLE DOES EXIST !!!');	
		}
		
		//WHERE CONCAT( nameFirst,  ' ', nameLast ) LIKE  '%Joe%'  
		//patient_surname LIKE '%s'
		$query=sprintf("SELECT *, concat(patient_surname, ' ', patient_firstname) as fullname FROM temp_table_patients
															WHERE (
																concat(patient_surname, ' ', patient_firstname) LIKE '%s'
																   
																  ) ORDER by patient_id DESC"
																  ,'%'.$q.'%'
																  );
		$patients=$wpdb->get_results($query);
		return $patients;
		
	}

	public static function searchPatients($q,$user){
		
		//create a temp table containing only patients belonging to a group
		global $wpdb;
		
		
		$query = $wpdb->prepare('CREATE TEMPORARY TABLE IF NOT EXISTS temp_table_patients AS
				(SELECT 
				 table_patients.patient_id,
				 table_patients.dob,
				 table_patients.patient_surname,
				 table_patients.patient_firstname,
				 table_patients.phone,
				 table_patients.email,
				 table_patients.clinic,
				 table_patients.practitioner,
			
				 table_group_user.group,
				 table_group_user.user

				 FROM table_patients
				 INNER JOIN table_group_user
				 on table_group_user.group = table_patients.group
				 WHERE table_group_user.user = %d)',$user);
		
		$wpdb->query($query);
		$table_name = 'temp_table_patients';
		if($wpdb->get_var("SHOW TABLES LIKE '$table_name'") != $table_name) {
		//table not in database. Create new table
		error_log('THE TABLE DOES NOT EXIST');
		}else{
		error_log('THE TABLE DOES EXIST !!!');	
		}
		
		//WHERE CONCAT( nameFirst,  ' ', nameLast ) LIKE  '%Joe%'  
		//patient_surname LIKE '%s'
		$query=sprintf("SELECT *, concat(patient_surname, ' ', patient_firstname) as fullname FROM temp_table_patients
															WHERE (
																concat(patient_surname, ' ', patient_firstname) LIKE '%s'
																   
																  ) ORDER by patient_id DESC"
																  ,'%'.$q.'%'
																  );
		$patients=$wpdb->get_results($query);
		return $patients;
		
	}
	
	public function findPatientMatch($patient){ // used by the book online page
		global $wpdb;
		$patient = json_decode(stripslashes($patient));
		$query = $wpdb->prepare('
			SELECT * from table_patients 
			WHERE table_patients.patient_surname = %s AND table_patients.patient_firstname = %s AND table_patients.dob = %s',
			$patient->surname,$patient->firstname,$patient->dob);
		$result=$wpdb->get_row($query);
		
		if ($result === NULL) {//no match was found
			error_log('no match found');
			$result = new StdClass;
			$result->match = false;
		}else{
			//we have a match.. include practitioner ID that the patient last had an encoubter with
			$query = $wpdb->prepare('
				SELECT user from table_encounters
				WHERE table_encounters.patient_id = %s ORDER BY id DESC LIMIT 1' ,
				$result->patient_id);
			$practitioner = $wpdb->get_var($query);
			if ($practitioner === NULL){ //there is no encounter, set val to 0 so 
				$practitioner = 0;
			}
			$result->{"last_encounter"} = $practitioner;
			//check if we have an email, if not or different update
			if($result->email != $patient->email) {
				$wpdb->update( 
				'table_patients',
					array( 'email' => $patient->email), 
					array( 'patient_id' => $result->patient_id)
				); 
				$result->email = $patient->email;
			}
			$result->{"match"} = true;
			error_log('match found');
		}
		
		error_log(json_encode($result));
		//error_log($result->match);
		return json_encode($result);
		
	}
	
	public static function getPatient($patient_id)	{
	global $wpdb;
	// get patient object 
	// take into account-> only get patients from clinic // to be added
	$query=sprintf('SELECT a.*, 
						b.display_name as practitioner_name
					FROM
	   					table_patients AS a
	   				INNER JOIN wp_users AS b ON a.practitioner=b.id  
					WHERE a.patient_id = "%s"',$patient_id);
	
	$patient=$wpdb->get_row($query);
	
	return  $patient;
	}
	
	public static function updatePatient($patient_id,$patient){
		$patient = json_decode(stripslashes($patient),true);
		global $wpdb;
		$array = array();
		foreach ($patient as $value) {
			$array[$value["name"]] = $value["value"];
		}
		$wpdb->update( 
				'table_patients',$array ,
				array( 'patient_id' => $patient_id)
	 	);

		return self::getPatient($patient_id);
		
		
	}
	
	public function addEncounter($encounter){
		global $wpdb;
		$wpdb->insert( 
				'table_encounters', 
				array( 
					'patient_id' => $encounter->patient_id,
					'user' => $encounter->user, 
					'start' => $encounter->start,
					'type' => $encounter->type
					) 
	 			);
		$id = $wpdb->insert_id;
		return self::getEncounter($id);
		
	}
	
	public function getEncounter($id){
		global $wpdb;
		$query = sprintf("SELECT * from table_encounters WHERE id = '%s'",$id);
		$encounter = $wpdb->get_row($query);
        return  $encounter;
	}
	

	public function getEncounters($patient_id){
		global $wpdb;
		$query = sprintf("SELECT
						 table_encounters.*,
						 
						 table_soap.id as soap_id,
						 table_soap.subjective,
						 table_soap.objective,
						 table_soap.assessment,
						 table_soap.plan,
						 
						 wp_users.display_name as username
						 
						 from table_encounters
						 INNER JOIN table_soap
						 ON table_encounters.id = table_soap.encounter_id
						 INNER JOIN wp_users
						 ON table_encounters.user = wp_users.ID
						 
						 WHERE (table_encounters.patient_id = '%s')
						 
						 ORDER BY table_encounters.start DESC",$patient_id);
		
		$encounters = $wpdb->get_results($query);
        return  $encounters;
	}

	public static function getVitals($patient_id){
		global $wpdb;
		$query = sprintf("SELECT * from table_vitals WHERE patient_id = '%s' ORDER BY `timestamp` DESC",$patient_id);
		$vitals = $wpdb->get_results($query);
		return $vitals;
	}

	public static function addVitals($vitals){
		error_log('adding the vitals in DB');
		global $wpdb;
		$vitals = json_decode(stripslashes($vitals),true);
		$data = array();
		foreach ($vitals as $value) {
			$data[$value["name"]] = $value["value"];
			
		}
		error_log(print_r($data,1));

		$wpdb->insert('table_vitals',$data);
		
	}

	public static function getHeight($patient_id){
		global $wpdb;
		return $height = $wpdb->get_var($wpdb->prepare("SELECT height FROM table_vitals WHERE patient_id = %d AND height IS NOT NULL ORDER BY 'timestamp' DESC",$patient_id));
		
	}

	
	public function getDiagnoses($patient_id){
		global $wpdb;
		$query = sprintf("
						 SELECT
						 table_patient_encounter_complaint_diagnosis.patient,
						 table_patient_encounter_complaint_diagnosis.encounter,
						 table_patient_encounter_complaint_diagnosis.complaint,
						 table_patient_encounter_complaint_diagnosis.diagnosis as diagnosis_id,
						 table_patient_encounter_complaint_diagnosis.comment as diagnosis_comment,
						 
						 
						 table_complaints.*,
						 
						 
						 table_diagnoses.diagnosis
						 
						 from table_patient_encounter_complaint_diagnosis
						 INNER JOIN table_complaints
						 ON table_patient_encounter_complaint_diagnosis.complaint = table_complaints.id
						 INNER JOIN table_diagnoses
						 ON table_patient_encounter_complaint_diagnosis.diagnosis = table_diagnoses.id
						 
						 WHERE (table_patient_encounter_complaint_diagnosis.patient = '%s')",$patient_id);
		$diagnoses = $wpdb->get_results($query);
        return  $diagnoses;
	}
	
	
	function doesComplaintHaveDiagnosisForThisEncounter($complaint,$encounter){
		global $wpdb;
		$query = sprintf("SELECT * from table_patient_encounter_complaint_diagnosis WHERE (complaint = '%d' AND encounter = '%d')",$complaint,$encounter);
		$result = $wpdb->get_results($query);
		if($wpdb->num_rows === 0){
			return false;
		}else{
			return true;	
			}
	}
	
	//insert new diagnosis into table
	
	public function addNewDiagnosis($diagnosis){
		global $wpdb;
		$wpdb->insert( 
				'table_diagnoses', 
				array( 
					'diagnosis' => $diagnosis
					)
	 			);
		 return '{"diagnosis":"'. $diagnosis.'","id":'.$wpdb->insert_id.'}';
		 
	}
	
	
	
	//add diagnosis to a complaint
	public function addDiagnosis($data){
		global $wpdb;
		parse_str($data);
		error_log('COMMENT IS ' . $comment);
		$wpdb->insert( 
				'table_patient_encounter_complaint_diagnosis', 
				array( 
					'encounter' => $encounter,
					'patient' => $patient,
					'complaint' => $complaint, 
					'diagnosis' => $diagnosis_id,
					'comment' => $comment
					) 
	 			);
		$id = $wpdb->insert_id;
	}
	
	public function searchDiagnoses($q){
		global $wpdb;
		$query=sprintf("SELECT * from table_diagnoses WHERE ( diagnosis LIKE '%s') ORDER BY diagnosis ASC ",'%'.$q.'%');
		$diagnoses=$wpdb->get_results($query);
		return $diagnoses;
	}
	
	
	public function updateDiagnosis($data){
		global $wpdb;
		parse_str($data);
		$wpdb->update( 
				'table_patient_encounter_complaint_diagnosis', 
				array( 
					'diagnosis' => $diagnosis_id,
					'comment' => $comment
					),
				array( 'encounter' => $encounter, 'complaint' => $complaint)
	 			);
	}
	
	public function addSOAP($SOAP){
		global $wpdb;
		$wpdb->insert( 
				'table_soap', 
				array( 
					'encounter_id' => $SOAP->encounter_id,
					'patient_id' => $SOAP->patient_id,
					'user' => $SOAP->user, 
					'created' => $SOAP->created
					) 
	 			);
		$id = $wpdb->insert_id;
		return self::getSOAP($id);
		
	}
	
	public function getSOAP($id){
		global $wpdb;
		$query = sprintf("SELECT * from table_soap WHERE id = '%s'",$id);
		$SOAP = $wpdb->get_row($query);
        return  $SOAP;
	}
	
	public function updateSOAP($SOAP){
		global $wpdb;
		//get the first element as it contains the id
		$id = array_shift($SOAP);
		$array = array();
		foreach ($SOAP as $value) {
			$array[$value["name"]] = $value["value"];
		}
		
		return $wpdb->update( 
				'table_soap',$array ,
				array( $id["name"] => $id["value"] )
	 	);
		
		
		
	}

	public function saveSOAP($soap_id,$field,$value){
		error_log($soap_id . ' ' . $field . ' '.$value);
		global $wpdb;
		$wpdb->update( 
				'table_soap', 
				array( 
					$field => $value
					
					),
				array( 'id' => $soap_id)
	 			);
		error_log('done!');
		
		
	}
	
	public function addComplaint($complaint){
		global $wpdb;
		$wpdb->insert( 
				'table_complaints', 
				array( 
					'encounter_id' => $complaint->encounter_id,
					'patient_id' => $complaint->patient_id,
					'user' => $complaint->user, 
					'open' => $complaint->open,
					'active' => $complaint->active
					) 
	 			);
		$id = $wpdb->insert_id;
		return self::getComplaint($id);
		
	}
	
	public function getComplaint($id){
		global $wpdb;
		$query = sprintf("SELECT * from table_complaints WHERE id = '%s'",$id);
		$complaint = $wpdb->get_row($query);
        return  $complaint;
	}
	
	
	
	public function updateComplaint($complaint){
		global $wpdb;
		//get the first element as it contains the id
		$id = array_shift($complaint);
		$array = array();
		foreach ($complaint as $value) {
			$array[$value["name"]] = $value["value"];
		}
		
		return $wpdb->update( 
				'table_complaints',$array ,
				array( $id["name"] => $id["value"] )
	 	);
		
		
		
	}
	
	public function saveComplaint($complaint_id,$field,$value){
		error_log($complaint_id . ' ' . $field . ' '.$value);
		global $wpdb;
		$wpdb->update( 
				'table_complaints', 
				array( 
					$field => $value
					
					),
				array( 'id' => $complaint_id)
	 			);
		error_log('done!');
		
		
	}
	
	public function saveHistory($patient_id,$field,$value){
		global $wpdb;
		$sql = "INSERT INTO table_history (patient_id,".$field.") VALUES (%d,%s) ON DUPLICATE KEY UPDATE ".$field." = %s";
		var_dump($sql); // debug
		$sql = $wpdb->prepare($sql,$patient_id,$value,$value);
		// var_dump($sql); // debug
		$wpdb->query($sql);
		
		
	}
	
	public function getHistory($patient_id){
		global $wpdb;
		$sql="SELECT * FROM table_history WHERE patient_id=%d";
		$sql = $wpdb->prepare($sql,$patient_id);
		$history = $wpdb->get_row($sql);
		if ($wpdb->num_rows === 0){ //there is no history for this patient .. insert one in DB
			$insert_sql = "INSERT INTO table_history (patient_id) VALUES (%d)";
			$insert_sql = $wpdb->prepare($insert_sql,$patient_id);
			$wpdb->query($insert_sql);
			
			$history = $wpdb->get_row($sql);
			error_log(print_r($history,1));
			return $history;
			
		} else {
			error_log(print_r($history,1));
			return $history;
		}
		
		
		
	}
	
	public function getAppointments($patient_id){
	global $wpdb;
	$query=sprintf('SELECT * from view_treatment_details WHERE patient_id = "%s" AND status <> 7 ORDER BY scheduled_date DESC',$patient_id);
	$appointments=$wpdb->get_results($query);
	return $appointments;
	}

	
	
	public function getPatientsForToday(){
	global $wpdb;
	$query=sprintf('select * from view_treatment_details WHERE scheduled_date="%s" and scheduled_practitioner_id=%s ORDER BY scheduled_time ASC',
		                                      date("Y-m-d", time()),
		                                      get_current_user_id());
	$patientsForToday=$wpdb->get_results($query);
	return $patientsForToday;
	}
	
	
	
}



function getClinic($clinic_id) {
	global $wpdb;
	//get clinic object
	$query= sprintf('SELECT * from table_clinics WHERE clinic_id = %s',$clinic_id); 
	$clinic = $wpdb->get_row($query);
	return $clinic;
}



?>