<script>

	var userID = <?= $userID?>;
	var patientID = <?= $patient_id?>;
	var patientName = '<?= $patient->patient_surname.' '.$patient->patient_firstname?>';
	var appointment_id  = <?= $appointment_id?>;
	
</script>

<input id="patient_id" type="hidden" value="<?= $patient->patient_id;?>">
<input id="practitioner_id" type="hidden" value="<?= $practitioner_id;?>">
<input id="clinic_id" type="hidden" value="<?= $patient->clinic;?>">
<input id="patient_name" type="hidden" value="<?=$patient->patient_surname.' '.$patient->patient_firstname?>">


<div class="col-sm-10 col-md-10 left-content" style="display:none;"><!-- Start Left content -->
	
	<!-- start: Breadcrumb -->
	<!-- <?php loadModule('breadcrumbs');?> -->
	<!-- /breadcrumb-->
	<div class="row">
	

	<div class="top_panel">
		<div class="panel with-nav-tabs panel-success">
						<div class="panel-heading">
							<ul class="nav nav-tabs">
							<li class=""><a href=""><i class="icon-user"></i><strong> <?= $patient->patient_surname.' '.$patient->patient_firstname?></strong></a></li>
								<li class="pull-right"><a href="#notes_tab" data-toggle="tab"><i class="far fa-sticky-note"></i> Notes </a></li>
								<li class="pull-right"><a href="#docs_tab" data-toggle="tab"><i class="far fa-file"></i> Docs<span class="docCount">(0)</span></a></li>
								<li class="pull-right"><a href="#pictureProof_tab" data-toggle="tab"><i class="fas fa-camera-retro"></i> PictureProof<span class="pictureProofCount">(0)</span></a></li>
								<li class="pull-right"><a href="#complaints" data-toggle="tab"><i class="fas fa-notes-medical"></i> Complaints</a></li>
								<li class="pull-right"><a href="#History" data-toggle="tab"><i class="fas fa-file-medical-alt"></i> History</a></li>
								<li class="pull-right"><a href="#vitals" data-toggle="tab"><i class="fas fa-heartbeat"></i> </a></li>
								<li class="pull-right active"><a href="#demographics" data-toggle="tab"><i class="fas fa-id-card-alt"></i></a></li>
							</ul>

							
							
						</div>
						<div class="panel-body">
							
							<div id="myTabContent" class="tab-content">
								<div class="tab-pane active" id="demographics"></div>
								<div class="tab-pane" id="vitals">vitals</div>
								<div class="tab-pane" id="History">
									<div id="history-panel" class="panel panel-success history">
            				<div class="panel-heading"><i class="fas fa-file-medical-alt"></i> History</div>
            				<div class='panel-body'>
              				<ul class="nav nav-tabs" id="history_tabs">
								<li class="active"><a href="#general_history" data-toggle="tab">General</a></li>
								<li><a href="#social_history" data-toggle="tab">Social</a></li>
								<li><a href="#orthotics_history" data-toggle="tab">Orthotics</a></li>
                				<li><a href="#paediatric_history" data-toggle="tab">Peadiatric</a></li>
              				</ul>

              		<div class='tab-content'>
                	<div class='tab-pane active' id='general_history'>
                  		adult
					</div>
					<div class='tab-pane' id='social_history'>
                  		social
					</div>
					<div class='tab-pane' id='orthotics_history'>
                  		orthotics
					</div>
                	<div class='tab-pane' id='paediatric_history'>
                  		child
					</div>
									
            </div>
						</div>	
					</div>
					</div>
					<div class="tab-pane" id="complaints">
						<div id="complaints-panel" class="panel panel-success">
            				<div class="panel-heading"><i class="fas fa-notes-medical"></i> Complaints</div>
            				<div class='panel-body'>
											Create a new encounter first to add a complaint.
							</div>
          				</div>
					</div>

					<div class="tab-pane" id="pictureProof_tab">
						<div id="pictureproof-panel" class="panel panel-info">
            				<div class="panel-heading"><i class="fas fa-camera-retro"></i> PictureProof saves</div>
            				<div class='panel-body'>
											Pictureproof
							</div>
          				</div>
					</div>
								<div class="tab-pane" id="docs_tab">
								

									<div id="docs-panel" class="panel panel-info">
										<div class="panel-heading"><i class="far fa-file"></i> Docs

										<button class="pull-right btn btn-sm btn-primary btnRefreshDocs"><i class="fas fa-sync-alt"></i></button>
										<button class="pull-right btn btn-sm btn-primary btnSelectDocs">Select</button>
                    					<button class="pull-right btn btn-sm btn-danger btnDeleteDocs"><i class="fas fa-trash-alt"></i></button>
										</div>
										<div class='panel-body'>
											
											<div id="docsPanel" class="row"></div>
											<div id="canvasPanel" class="row">
											<button class="btn btn-warning" id="btnRotatePlus90"><i class="fas fa-sync-alt"></i></button>
											<button class="btn btn-warning" id="btnSaveDoc"><i class="fas fa-save"></i></button>
											<button class="btn btn-danger" id="btnCloseDoc"><i class="fas fa-window-close"></i></button>
											<canvas id="c" style="border:1px solid black;" ></canvas>
											</div>
											
										</div>
								</div>


									
								</div>
								<div class="tab-pane" id="notes_tab">
									<div class="row">
										<div class="col-xs-2"><img width="100%" src="assets/img/face-placeholder.jpg"></div>
										<div class="col-xs-9">
										<label class="control-label" for="textarea2">Notes</label>
								  					
											<div class="box">
												
								  					
														<div contenteditable="true" id="thierry" rows="6">
														<?= $patient->notes?>
														</div>
											</div>
											<button onclick="saveNotes();" type="button" class="btn btn-primary">Save</button>
											
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
		
	</div><!--/col-->
	</div><!--/row-->
<div class="row">
	<div id="summary-panel" class="panel panel-success">
            				<div class="panel-heading">
								<i class="fas fa-notes-medical"></i> Summary
							</div>
            				<div class='panel-body'></div>
    </div>
</div>

<div class='row'>
	<div class="list-encounters">
	<!--<div class="col-md-12 visible-md visible-lg list-encounters">Start encounter flow -->
	 Click on de + button to add a new encounter.
					
	</div><!--/history flow -->
</div><!--/row-->


</div><!--/row -->
</div><!--/col /left content -->

<div class="col-md-2 hidden-xs hidden-sm" id="feed"><!-- Start Right content -->
	<!--start right menu -->
		<?php loadModule('patient_menu');?>
				
					
	<!--/right menu -->
	<div id="patient_appointments">
	</div>

	<div class="btn-group btn-group-justified" role="group">
       <a class="btn btn-danger deletePatient" role="button">Delete Patient</a>
    </div>
	</div>
	<!--/col /Right Content-->

<!--</div>/row-->




<!--start:diagnoses-modal -->
<div class="modal fade" id="diagnosesModal">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
		<h3 class="modal-title">Search diagnosis</h3>      
      </div>
      <div class="modal-body">
		<form role="form">
		<div class="form-group">
			<input class="form-control" autocomplete="off" id="searchinputDiagnoses" type="search" size="30" placeholder="Search diagnoses..." />
		</div>
		<div id="searchlistDiagnoses" class="list-group">
			
			<!-- FILLED DYNAMICALLY -->
		</div>
	</form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>
<!--stop: diagnoses-modal -->

<div class="modal fade" id="recordEncounterModal" tabindex="-1" role="dialog">
  <div class="modal-dialog" role="document">
    <div class="modal-content">

      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal">×</button>
        <h3>Record encounter</h3>
      </div>

      <div class="modal-body">
        <p id="recStatus" class="muted">Ready.</p>

        <div class="btn-toolbar" style="margin-bottom:10px;">
          <button id="btnRecStart" class="btn btn-danger">Record</button>
          <button id="btnRecPause" class="btn" disabled>Pause</button>
          <button id="btnRecResume" class="btn" disabled>Continue</button>
          <button id="btnRecDone" class="btn btn-success" disabled>Done</button>
        </div>

		<div class="btn-toolbar" style="margin-bottom:10px;">
			<label class="checkbox"><input type="checkbox" id="recSoapOnly" value="1">
 			 SOAP only (follow-up)
			</label>
			
		</div>
		

		<div id="recRecoverActions" style="margin-top:10px; display:none;">
			<button
				id="btnRetryUpload"
				class="btn btn-warning"
				style="display:none;"
				disabled>
				Retry upload
			</button>

			<a
				id="btnDownloadRecording"
				class="btn btn-info"
				href="#"
				download="encounter.webm"
				style="display:none;">
				Download recording
			</a>
		</div>

        <hr>
		<span class="help-block muted" style="margin-top:5px;">
            If the connection drops, the recording is saved locally and can be retried.
          </span>
        <audio
          id="recPlayback"
          controls
          style="width:100%; display:none;">
        </audio>
      </div>

      <div class="modal-footer">
		<input type="file" id="recUploadFile" accept="audio/*" style="display:none" />
			<label for="recUploadFile" class="btn btn-info">
  				Upload audio file from disk
			</label>
        <button class="btn" data-dismiss="modal">Close</button>
      </div>

    </div>
  </div>
</div>

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
						<select class="form-control from" id="clinic" name="clinic">
							<?php
							foreach($clinics as $clinic) {
								if ($clinic->clinic_id == $patient->clinic) {
									echo sprintf('<option clinic_id ="%s" value="%s" selected>%s</option>',$clinic->clinic_id,$clinic->clinic_id,$clinic->clinic_name);
								} else {
									echo sprintf('<option clinic_id ="%s" value="%s">%s</option>',$clinic->clinic_id,$clinic->clinic_id,$clinic->clinic_name);
								}
							}
							?>
						</select>
								
							
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






<!-- Mustache Templates -->





<script id='tmpl_complaint_tab' type='xml-tmpl-mustache'>
	<li class="{{active}} complaint_tab"><a id="{{complaint_tab_id}}" data-toggle="tab" href="#{{pane_name}}">{{tab_title}}</a></li>
</script>

<script id='tmpl_complaint_init' type='xml-tmpl-mustache'>
	
									<div class="row">
									<div class="col-sm-12">
								
									<ul id="complaints_tabs" class="nav nav-tabs">
										{{#enabled}}<li class="add_complaint"><a  href="#add">+ Add Complaint</a></li>{{/enabled}}	
									</ul>

									<div id="complaints_panes" class="tab-content">
										<div class="tab-pane active" id="add"><br>No complaints<br></div>
									</div>
								
								
								</div>
								</div>
								
</script>




<?php include(TEMPLATES . 'demographics_panel.html'); ?>
<?php include(TEMPLATES . 'vitals_panel.html'); ?>
<?php include(TEMPLATES . 'encounter_flow.html'); ?>
<?php include(TEMPLATES . 'complaint.html'); ?>
<?php include(TEMPLATES . 'general_history.html'); ?>
<?php include(TEMPLATES . 'paediatric_history.html'); ?>
<?php include(TEMPLATES . 'social_history.html'); ?>
<?php include(TEMPLATES . 'orthotics_history.html'); ?>
<?php include(TEMPLATES . 'encounter_print.html'); ?>
<?php include(TEMPLATES . 'patient_appointments.html'); ?>
<?php include(TEMPLATES . 'summary.html'); ?>





