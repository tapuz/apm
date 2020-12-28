<?php

require_once('../../../../wp-config.php');

$method = $_GET["method"];
$method();


				


function searchPatient()
{
	
	global $wpdb;
	$wpdb->show_errors();
	$query= sprintf('SELECT * FROM table_patients WHERE patient_surname LIKE "%s%s"',$_GET["q"],'%');
	$patients = $wpdb->get_results($query);
?>	
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
				  <td><a href="index.php?com=patient&patient_id='. $patient->patient_id . '"> ' . $patient->patient_surname . ' ' . $patient->patient_firstname . '</a></td>
				  <td>'. $patient->dob.'</td>
				  <td>'. $practitioner->user_lastname . ' ' . $practitioner->user_firstname.'<td>
				  
			  </tr>';

	}
	
?>
								  </tbody>
							 </table>  
							      
						</div>
					</div>
<?

}

function getPatientDetails()
{

	global $wpdb;
	$query= sprintf('SELECT * from table_patients WHERE patient_id = "%s"',$_GET["patient_id"]);
	//$query= sprintf('SELECT * from table_patients');
	$patient = $wpdb->get_row($query);

	//get user info
	$user = get_userdata($patient->practitioner);
	//get appointments
	$query = sprintf('SELECT * from view_treatment_details WHERE patient_id = "%s" AND status <> 7 ORDER BY scheduled_date DESC',$_GET["patient_id"]);
	$appointments = $wpdb->get_results($query);
	
	
	
	
	
	
	
	
	

?>


	<ul data-role="listview" data-inset="true" data-divider-theme="d">
        <li data-role="fieldcontain">
        	<img src="images/face-placeholder.jpg">
            <h2><?echo $patient->patient_surname .' ' .$patient->patient_firstname?></h2>
            <p><strong>ID </strong><?echo $patient->patient_id?></p>
            <p><strong>DOB </strong><?echo $patient->dob?></p>
            <br>
			<p><strong>Physician: </strong><? echo $user->user_lastname . ' ' . $user->user_firstname; ?></p>
            
        </li>
        <li data-role="list-divider">Contact details</li>
        <li data-icon="false">
        	<?echo sprintf('<a href="http://maps.google.com/?q=%s %s %s %s">',$patient->address,$patient->postcode,$patient->city,$patient->country);?>
        	<?echo sprintf('%s - %s %s - %s',$patient->address,$patient->postcode,$patient->city,$patient->country)?>
         	
         	</a>
        </li>
        
        <?if ($patient->phone != NULL){echo sprintf('<li data-icon="false"><a href="tel:%s" rel="external">%s</a></li>',$patient->phone,$patient->phone);}?>
        <?if ($patient->phone_work != NULL){echo sprintf('<li data-icon="false"><a href="tel:%s" rel="external">%s</a></li>',$patient->phone_work,$patient->phone_work);}?>
        <?if ($patient->gsm != NULL){echo sprintf('<li data-icon="false"><a href="tel:%s" rel="external">%s</a></li>',$patient->gsm,$patient->gsm);}?>
        <?if ($patient->email != NULL){echo sprintf('<li data-icon="false"><a href="mailto:%s" rel="external">%s</a></li>',$patient->email,$patient->email);}?>
           
        
        <li data-role="list-divider">Info</li>
        <li>
        <p><strong>Profession: </strong><?echo $patient->profession;?></p>
        <p><strong>Insurance: </strong><?echo $patient->insurance;?></p>
        <p><strong>Referrer: </strong><?echo $patient->referrer;?></p>
        
        
        </li>
        
    </ul>
        
       
    <div data-role="collapsible-set" data-theme="c" data-content-theme="d" data-collapsed-icon="arrow-r" data-expanded-icon="arrow-d">
    	<div data-role="collapsible" data-collapsed="false">
        	<h3>Consultations</h3>
        		<table data-role="table" class="ui-body-d ui-shadow table-stripe ui-responsive">
		         <thead>
		           <tr class="ui-bar-d">
		             <th data-priority="1">Date</th>
		             <th data-priority="1">Time</th>
		             <th data-priority="2">Physician</th>
		   		   </tr>
		         </thead>
		         <tbody>
		           
		           <?foreach ($appointments as $appointment) 
     				{?>		
		           <tr>
		           	 <td><?echo $appointment->scheduled_date?></td>
		             <td><?echo $appointment->scheduled_time?></td>
		             <td><?echo $appointment->scheduled_practitioner_name?></td>
		             
		           </tr>
        	
    			
			    <? }?>
			    </tbody>
   			   </table>
    	</div>
   </div>
       
<?	
}
?>

