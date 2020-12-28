<div class="box">
						<div class="box-header">
							<h2><i class="icon-group"></i><span class="break"></span>Search Results</h2>
							
								
							
						</div>
						<div class="box-content">
							<table class="table">
								  <thead>
									  <tr>
										  <th>ID</th>
										  <th>Patient Name</th>
										  <th>DOB</th>
										  <th>Practitioner</th>
									  </tr>
								  </thead>   
								  <tbody>
								  
									
								                                   
								

<?
	
	foreach ($patients as $patient) {
    	// get practitioner name
    	$practitioner = get_userdata($patient->practitioner);
    	
		echo '<tr><td>' . $patient->patient_id .'</td>
				  <td><a href="index.php?com=patient&view=patient&patient_id='. $patient->patient_id . '"> ' . $patient->patient_surname . ' ' . $patient->patient_firstname . '</a></td>
				  <td>'. $patient->dob.'</td>
				  <td>'. $practitioner->user_lastname . ' ' . $practitioner->user_firstname.'<td>
				  
			  </tr>';

	}
	
?>
								  </tbody>
							 </table>  
							      
						</div>
					</div>