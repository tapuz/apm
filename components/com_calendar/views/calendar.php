<script>
	//some vars injected from PHP in to JS
	var currentUserID = <?=$currentUserID?>;
	var currentUser = <?=json_encode($current_user)?>;
	var clinicPresent = <?=$clinicPresent?>;
	
</script>

<?
//view calendar
?>

<input type="hidden" id="selectedUserID" value="<?=$selectedUserID;?>">


<div class="row">
	
	    <div id="calSelectToolbar">
				<div class="col-md-12">
					<form class="form-inline">
					</form>
				</div>
		
		</div>
			
			<br>
			<!-- start: calendar -->
		
			
			<div id="calendar" class="col-md-12">
				
			</div>
			<div class="col-md-3" id="rightPanel"><!-- Start Right content -->
				<div class="row header">
					<div class="input-group" style="padding: 5px;">
						<span class="input-group-addon clear_right_panel_search"><i class="far fa-times-circle"></i></span>
						<input type="text" class="form-control patient-search" pattern="^[a-zA-Z '.-]+$" placeholder="Find patient" required>
						<span class="input-group-addon"><i class="fa fa-search"></i></span>
					</div>
					
				</div>
				
				<div class="content">
				
					<div class="default">
						<div class="row">
							<div id="datePicker"></div>
						</div>
					</div>
					<div class="row">
					<div style="height:2px;" id="rightPanelProgress">&nbsp;</div>
					</div>
					<div class="search_results"></div>
					<div class="patient_details">
						<div class="patient_demographics"></div>
						<div class="patient_appointments"></div>
					</div>
					<div class="row">
							<div id="rooms_status"></div>
					</div>
					
					<div class="row">
							<div id="custom_timeslots"></div>
					</div>
					
				</div>
			</div>
	
			


<!--end calendar-->

	
	
</div>




<!--start: modal -->

<div class="modal modal-wide fade" id="editEvent" role="dialog" tabindex="-1">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
		<h5 class="modal-title">Add Appointment</h5>
      </div>
      <div class="modal-body">
		<!-- Nav tabs -->
	
    	<ul class="nav nav-pills">
			<li class="active"><a  href="#patientAppointment" data-toggle="tab"><i class="fa fa-user"></i>&nbsp;&nbsp;Patient Appointment</a></li>
			<li id='tab_busyTime'><a  href="#busyTime" data-toggle="tab"><i class="fas fa-ban"></i>&nbsp;&nbsp;Busy Time</a></li>
			<li id='tab_addWorkingSlot'><a  href="#addWorkingSlot" data-toggle="tab"><i class="fas fa-poll-h"></i>&nbsp;&nbsp;Add custom timeslot</a></li>
			
		</ul> 
	
		
		<div class="tab-content">
			
            <div class="tab-pane active" id="patientAppointment">
                <div class="patient-section">
					<form id="editAppointment" role="form" data-toggle="validator">
					
					<div class="row">
						<div class="col-sm-2">
							<label class="patient-name">Date</label>
						</div>
						<div class="col-sm-5">
							<div class="row">
								<span class="datetime"></span>
								
							</div>
						</div>	
					</div>
					<div class="row">
						<div class="col-sm-2">
							<label class="patient-name">Clinic</label>
						</div>
						<div class="col-sm-5">
							<div class="row">
								<span class="selectClinic"></span><span class="text-danger warningSelectClinic" style="display: none;">Patient not usually booked at this location!</span>
								
							</div>
						</div>	
					</div>
					<div class="row">&nbsp</div>
                    <div class="row">
                        <div class="col-sm-2">
							<label class="patient-name">Patient</label>
						</div>
                        <div class="col-sm-9">
								<div class="row patient-select">
									<div class="col-sm-9">
										<div class="input-group" style="padding: 5px;">
											<span class="input-group-addon"><i class="fa fa-fw fa-user"></i></span>
											<input type="text" class="form-control" id="patient-search" pattern="^[a-zA-Z '.-]+$" placeholder="Patient last and first name" required>
										</div>
										<div class="input-group" style="padding: 5px;">
											<span class="input-group-addon"><i class="fa fa-fw fa-phone"></i></span>
											<input type="tel" class="form-control" id="phone" placeholder="Telephone">
										</div>
										<div class="input-group" style="padding: 5px;">
											<span class="input-group-addon"><i class="fa fa-fw fa-envelope-o"></i></span>
											<input type="email" class="form-control" id="email" placeholder="Email">
											
										</div>
									</div>
								</div>
							
							
							<div class="row">
								<div class="col-sm-9 selected">
									<p>
										<span class="selected-patient-name"></span>
										<span class="pull-right"><a title="Remove patient from event" class="clear-selected-patient"><i class="fa fa-times-circle">&nbsp;</i></a></span>
									</p>
									<p class="selected-patient-details">
										<span class="selected-dob-holder">
											<i class="fa fa-calendar-o"></i> <span class="selected-dob"></span> &nbsp; &nbsp;
										</span>
										<span class="selected-telephone-holder">
											<i class="fa fa-fw fa-phone"></i> <span class="selected-telephone"></span> &nbsp; &nbsp;
										</span>
										<span class="selected-mobile-holder hide">
											<i class="fa fa-fw fa-mobile-phone"></i>+32 <span class="selected-mobile">474323335</span> &nbsp; &nbsp;
										</span>
										<span class="selected-email-holder">
											<i class="fa fa-fw fa-envelope-o"></i> <span class="selected-email"></span>&nbsp; &nbsp;
										</span>
										<span class="selected-clinic-holder">
											<i class="fa fa-hospital-o"></i> <span class="selected-clinic">RUGCENTRUM GENT</span>
										</span>
										<span class="selected-practitioner-holder">
										<i class="fas fa-user-md"></i> <span class="selected-practitioner">RUGCENTRUM GENT</span>
										</span>
										
										

									</p>
								</div>
								
		
							</div>	
						</div>
                    </div>
					<div class="row">&nbsp</div>
					<div class="row">
						<div class="col-sm-2">
							<label class="patient-name">Service</label>
						</div>
						<div class="col-sm-5">
							<div class="row">
								<span class="selectService"></span>
								
							</div>
						</div>	
					</div>

					<div class="row">&nbsp</div>
					<div class="row">
						<div class="col-sm-2">
							<label class="patient-name">Note</label>
						</div>
						<div class="col-sm-5">
							<div class="row">
								<input type="text" class="form-control" id="note" pattern="^[a-zA-Z0-9 '.-]+$" placeholder="" >	
								
								
							</div>
						</div>	
					</div>
					<div class="row">
					<div class="col-md-6" data-toggle="buttons">
						<label class="status confirmed btn btn-sm" status="0"><input type="radio" value="0"> Confirmed</label>
						<label class="status pencilled btn btn-sm" status="2"><input type="radio" value="2"> Pencilled</label>
					</div>
					</div>

					<div class="row">&nbsp;</div>
					<div class="row">
						<div class="col-sm-2">
						 <button type="submit" class="btn btn-primary editAppSubmit">Save</button>
						</div>	
						<div class="col-sm-2">
        		 <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
						</div>
						<div class="col-sm-8"></div>
					</div>
				</form>
      </div>
				
      </div>

			<div class="tab-pane" id="busyTime">
				<form id="editBusyTime" role="form" data-toggle="validator">
					
				<div class="row">
						<div class="col-sm-3">
							<label>Time</label>
						</div>
						<div class="col-sm-5">
							<span class="datetime"></span>
						</div>	
				</div>

				<div class="row">

					<div class="col-sm-3">
						<label for="duration">Duration</label>

					</div>
					<div class="col-sm-5">
					
  						<select class="form-control duration">
    						<option value="10">10min</option>
    						<option value="15">15min</option>
    						<option value="30">30min</option>
    						<option value="45">45min</option>
							<option value="60">1h</option>
							<option value="90">1h30min</option>
							<option value="120">2h</option>
 					 	 </select>

					</div>
				</div>
				<div class="row">

					<div class="col-sm-3">
						<label>Description</label>

					</div>
					<div class="col-sm-5">
						<textarea class="form-control" cols="15" id="busyTimeDesc" rows="2"></textarea>

					</div>
				</div>

				<div class="row">
						<div class="col-sm-3">
						 <button type="submit" class="btn btn-primary editBusyTimeSubmit">Save</button>
        				 <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
						 </div>
				</div>



			</form>

			</div>
			<!-- END PANE-->
			<div class="tab-pane" id="addWorkingSlot">
                <div class="patient-section">
					<form id="addWorkingSlot" role="form" data-toggle="validator">
					
					<div class="row">
						<div class="col-sm-2">
							<label class="patient-name">Date</label>
						</div>
						<div class="col-sm-5">
							<div class="row">
								<span class="datetime"></span>
								
							</div>
						</div>	
					</div>
					<div class="row">
						<div class="col-sm-2">
							<label class="patient-name">Clinic</label>
						</div>
						<div class="col-sm-5">
							<div class="row">
								<span class="selectClinic"></span>
								
							</div>
						</div>	
					</div>
					<div class="row">
						<div class="col-sm-2">
							<label class="patient-name">Service</label>
						</div>
						<div class="col-sm-5">
							<div class="row">
								<span class="selectService"></span>
								
							</div>
						</div>	
					</div>

					<div class="row">&nbsp</div>
					
					
					<div class="row">&nbsp;</div>
					<div class="row">
						<div class="col-sm-2">
						 <button type="submit" class="btn btn-primary addWorkingSlotSubmit">Save</button>
						</div>	
						<div class="col-sm-2">
        		 <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
						</div>
						<div class="col-sm-8"></div>
					</div>
				</form>
      </div>
				
      </div>
	  <!-- End pane-->
            
		</div>
		
       
      </div>
      <div class="modal-footer">
       
      </div>
    </div>
	
  </div>
</div>
<!--stop: modal -->


<!--start: eventDetails-modal -->
<div class="modal modal-wide fade" id="eventDetails" role="dialog" tabindex="-1">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
    
    </div>
  </div>
</div>
<!--stop: eventDetails-modal -->

<!--start: customEvent-modal -->
<div class="modal modal-wide fade" id="customEventDetails">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
		<h3 class="modal-title">Edit Busy Time</h3>      
      </div>
      <div class="modal-body">
	  <div class="row">
				<div class="col-sm-3">
					<label>Date</label>
				</div>
				<div class="col-sm-5">
					<span class="datetime"></span>
				</div>
				
		</div>
	  

				<div class="row">

					<div class="col-sm-3">
						<label>Duration</label>

					</div>
					<div class="col-sm-5">
						<span class="duration"></span><span> minutes</span>
					</div>
				</div>
				<div class="row">

					<div class="col-sm-3">
						<label>Description</label>

					</div>
					<div class="col-sm-5">
						<textarea class="form-control description" cols="15" rows="2" disabled></textarea>
					</div>
				</div>
				<div class="row">
				<div class="col-sm-5">
					<button type="button" class="btn btn-danger deleteAppointment"><i class="fa fa-trash-o"></i>&nbsp;Delete</button>'
				</div>
				</div>

		
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>
<!--stop: customEvent-modal -->

<!--start: editPatient-modal -->
<div class="modal modal-wide fade" id="editPatient">
  <div class="modal-dialog  role="document">
	<form id="editPatientForm" role="form" data-toggle="validator">
    <div class="modal-content">
      <div class="modal-header well">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
		<h3 class="modal-title">Edit Patient</h3>      
      </div>
      <div class="modal-body">
		<div class="loading">Loading patient...</div>
		<div class="patientDetails" style="display: none;">
		<div class="row">
			
			<div class="col-sm-6">
				<div class="form-group ">
					<label class="" for="Patient_FirstName">First name</label>
					<input autocomplete="off" class="first form-control" id="Patient_FirstName" name="patient_firstname" type="text">
				</div>
			</div>
			<div class="col-sm-6">
				<div class="form-group ">
					<label class="" for="Patient_LastName">Last name</label>
					<input autocomplete="off" class="last form-control" id="Patient_LastName" name="patient_surname" type="text">
				</div>
			</div>
		</div>
		<div class="row">
			<div class="col-sm-6">
				<div class="form-group ">
					<label>Date of birth</label>
					<input autocomplete="off" class="last form-control" id="Patient_DOB" name="dob" type="text">
				</div>
			</div>
			<div class="col-sm-6">
				<div class="form-group ">
					<label class="" for="Patient_LastName">Sex</label>
					<select name=sex id="Patient_Sex" class="form-control" style="width:100px;">
						<option value="male">Male</option>
						<option value="female">Female</option>
					</select>
				</div>
			</div>
		</div>
		<div class="row">
			<div class="col-sm-3">
				<div class="form-group ">
					<label class="" for="Patient_FirstName">Telephone</label>
					<input autocomplete="off" class="first form-control" id="Patient_Phone" name="phone" type="text">
				</div>
			</div>
			<div class="col-sm-3">
				<div class="form-group ">
					<label class="" for="Patient_FirstName">Mobile</label>
					<input autocomplete="off" class="first form-control" id="Patient_Mobile" name="gsm" type="text">
				</div>
			</div>
			<div class="col-sm-6">
				<div class="form-group ">
					<label class="" for="Patient_LastName">Email</label>
					<input autocomplete="off" class="last form-control" id="Patient_Email" name="email" type="text">
				</div>
			</div>
		</div>
		
		<div class="row">
			<div class="col-sm-6">
				<div class="form-group ">
					<label class="" for="Patient_FirstName">Address</label>
					<input autocomplete="off" class="first form-control" id="Patient_Address" name="address" type="text">
				</div>
				<div class="form-group ">
					<label class="" for="Patient_FirstName">Postcode</label>
					<input autocomplete="off" class="first form-control" id="Patient_Postcode" name="postcode" type="text">
				</div>
			
			
				<div class="form-group ">
					<label class="" for="Patient_LastName">City</label>
					<input autocomplete="off" class="last form-control" id="Patient_City" name="city"  type="text">
				</div>
				<div class="form-group ">
					<label class="" for="Patient_LastName">Country</label>
					<input autocomplete="off" class="last form-control" id="Patient_Country" name="country"  type="text">
				</div>
			</div>
			<div class="col-sm-6">
				<div class="form-group ">
					<label class="" for="Patient_Profession">Profession</label>
					<input autocomplete="off" class="first form-control" id="Patient_profession" name="profession" type="text">
				</div>
				<div class="form-group ">
					<label class="" for="Patient_Insurance">Insurance</label>
					<input autocomplete="off" class="first form-control" id="Patient_Insurance" name="insurance" type="text">
				</div>
				<div class="form-group">
					<label class="" for="Patient_Clinic">Clinic</label>
					<span class="selectClinic"></span>
					
				</div>
			</div>	
		</div>
		</div>
		<div class="row">
			
			
		</div>
		
      </div>
      <div class="modal-footer well">
		<button type="submit" class="btn btn-primary">Save</button>
		<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
		
        
      </div>
    </div>
	</form>
  </div>
</div>
<!--stop: editPatient-modal -->

<!--start:payment-modal -->
<div class="modal fade" id="paymentModal">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
		<h3 class="modal-title">Add Payment</h3>      
      </div>
      <div class="modal-body">
		<form id="payment" class="form-horizontal">
			<div class="form-group">
				<label class="col-md-4 control-label" for="date">Date</label>
				<div class="col-md-4">
					<p class="form-control-static payment_date"></p>
				</div>
			</div>
			<div class="form-group">
				<label class="col-md-4 control-label" for="clinics">Clinic</label>
				<div class="col-md-6">
					<p class="form-control-static clinic"></p>
				</div>
			</div>
			<div class="form-group">
				<label class="col-md-4 control-label" for="practitioner">Practitioner</label>
				<div class="col-md-6">
					<p class="form-control-static practitioner"></p>
				</div>
			</div>
			<div class="form-group">
				<label class="col-md-4 control-label" for="description">Description</label>
				<div class="col-md-4">
					<input id="description" name="description" type="text" placeholder="Description" class="form-control input-md description">
				</div>
			</div>
			<div class="form-group">
				<label class="col-md-4 control-label" for="fee">Fee</label>
				<div class="col-md-4">
					<div class="input-group">
						 <span class="input-group-addon"><i class="fa fa-euro"></i></span>					
						<input type="text" name="fee" class="form-control input-md fee">
					</div>
				</div>
			</div>
			<div class="form-group">
				<label class="col-md-4 control-label" for="paymentMethod">Method</label>
				<div class="col-md-4">
					<select id="paymentMethod" name="paymentMethod" class="form-control">
						
					</select>
				</div>
			</div>
		</form>	
		
      
	  </div>
      <div class="modal-footer">
	  	<button type="submit" class="btn btn-success add_invoice">Add Payment & Invoice</button>
		<button type="submit" class="btn btn-success add_payment">Add Payment</button>
        <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>
<!--stop: payment-modal -->

<!--start:email-modal -->
<div class="modal fade modal-wide" id="emailModal">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
		<h3 class="modal-title">Send email</h3>      
      </div>
      <div class="modal-body">
		<form id="sendEmailForm" class="form-horizontal">
			<div class="col-lg-12">
				<div class="row">
					<div class="form-group">
						<div class="col-md-2"><label class="control-label" for="to">To</label></div>
						<div class="col-md-10"><input type="text" name="to" class="form-control input-md to"></div>
					</div>
				</div>

				<div class="row">
					<div class="form-group">
						<div class="col-md-2"><label class="control-label" for="subject">Subject</label></div>
						<div class="col-md-10"><input type="text" name="subject" class="form-control input-md subject"></div>
					</div>
				</div>
				
				<div class="row">
					<div class="form-group">
						<div class="col-md-2"><label class="control-label" for="email">Message</label></div>
						<div class="col-md-10"><textarea class="form-control body" rows="6" placeholder="Message" name="body"></textarea></div>
					</div>
				</div>

				<div class="row">
					<div class="form-group">
						<div class="col-md-2">
							<label>Send from</label>
						</div>
						<div class="col-md-5 selectFrom">
							
								
							
						</div>	
					</div>
				</div>
			</div>
			
			
			
		</form>	
		
      
	  </div>
      <div class="modal-footer">
	  	<button type="submit" class="btn btn-success sendEmail">Send email</button>
        <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>
<!--stop: email-modal -->

<!--start:custom timeslots -->
<div class="modal fade modal-wide" id="customTimeslotsModal">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
		<h3 class="modal-title">Custom Timeslots</h3>      
      </div>
      <div class="modal-body">
		No custom timeslots for this week...
	  </div>
      <div class="modal-footer">
	  	
        <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>
<!--stop: custom timeslots -->







<!--load the Templates-->

<?php include(TEMPLATES . 'right_panel.html'); ?>
<?php include(TEMPLATES . 'main.html'); ?>







