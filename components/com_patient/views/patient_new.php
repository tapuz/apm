<script>

	var userID = <?=$userID?>;
	var patientID = <?=$patient_id?>;
	var patientName = '<?=$patient->patient_surname.' '.$patient->patient_firstname?>';
	
</script>

<input id="patient_id" type="hidden" value="<?= $patient->patient_id;?>">
<input id="practitioner_id" type="hidden" value="<?= $practitioner_id;?>">
<input id="clinic_id" type="hidden" value="<?= $patient->clinic;?>">
<input id="patient_name" type="hidden" value="<?=$patient->patient_surname.' '.$patient->patient_firstname?>">


<div class="col-sm-10 col-md-10 left-content" style="display:none;"><!-- Start Left content -->
	
	<!-- start: Breadcrumb -->
	<!-- <?loadModule('breadcrumbs');?> -->
	<!-- /breadcrumb-->
	<div class="row">
	

	<div class="col-xs-12 top_panel">
		<div class="box">
						<div class="box-header">
							<h2><i class="icon-user"></i><strong><?= $patient->patient_surname.' '.$patient->patient_firstname?></strong></h2>
							<ul class="nav tab-menu nav-tabs" id="myTab">
								<li class="active"><a href="#demographics">Demographics</a></li>
								<li><a href="#History">History</a></li>
								<li><a href="#complaints">Complaints</a></li>
								<li><a href="#notes_tab">Notes</a></li>
							</ul>
							
						</div>
						<div class="box-content">
							
							<div id="myTabContent" class="tab-content">
								<div class="tab-pane active" id="demographics"></div>
								<div class="tab-pane" id="History">
									<div id="history-panel" class="panel panel-success history">
            				<div class="panel-heading">History</div>
            				<div class='panel-body'>
              				<ul class="nav nav-tabs" id="history_tabs">
                				<li class="active"><a href="#general_history" data-toggle="tab">General</a></li>
                				<li><a href="#paediatric_history" data-toggle="tab">Peadiatric</a></li>
              				</ul>

              		<div class='tab-content'>
                	<div class='tab-pane active' id='general_history'>
                  	adult
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
            				<div class="panel-heading">Complaints</div>
            				<div class='panel-body'>
											Create a new encounter first to add a complaint.
								  </div>
          			</div>
          			<!-- /panel -->
								</div>
								<div class="tab-pane" id="notes_tab">
									<div class="row">
										<div class="col-xs-2"><img width="100%" src="assets/img/face-placeholder.jpg"></div>
										<div class="col-xs-9">
										<label class="control-label" for="textarea2">Notes</label>
								  					
											<div class="box">
												
								  					
														<div contenteditable="true" id="thierry" rows="6">
														<?echo $patient->notes?>
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


<div class='row'>
	<div class="col-md-12 visible-md visible-lg list-encounters"><!--Start encounter flow -->
	 Click on de + button to add a new encounter.
					
	</div><!--/history flow -->
</div><!--/row-->
<div class="row">
	
  				
	<div class="col-xs-8 col-md-8 hidden">
	<div class="box">
						<div class="box-header">
							<h2><i class="icon-reorder"></i><span class="break"></span>Consultations</h2>
							
								
							
						</div>
						<div class="box-content">
							<table class="table">
								  <thead>
									  <tr>
										  <th>Date</th>
										  <th>S</th>
										  <th>O</th>
										  <th>T</th>
										  <th>Practitioner</th>
									  </tr>
								  </thead>   
								  	<tbody>
					<?
					foreach($appointments as $appointment){
						?>
						<tr>
							<td>
								<?
								echo $appointment->scheduled_date?>
							</td>
							<td>++</td>
							<td>SLR 95deg</td>
							<td>T10;L5</td>
							<td>
								<?
								echo $appointment->scheduled_practitioner_name?>
							</td>
						</tr>
						<?
					}
					?>
				</tbody>
							</table>
						</div><!--/box-content -->
	</div><!--/box --->
	</div><!--/col -->
</div><!--/row -->
</div><!--/col /left content -->

<div class="col-md-2 hidden-xs hidden-sm" id="feed"><!-- Start Right content -->
	<!--start right menu -->
		<?loadModule('patient_menu');?>
				
					
	<!--/right menu -->
	

</div><!--/col /Right Content-->

<!--</div><!--/row-->




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





<!-- Mustache Templates -->





<script id='tmpl_complaint_tab' type='xml-tmpl-mustache'>
	<li class="{{active}}"><a id="{{complaint_tab_id}}" data-toggle="tab" href="#{{pane_name}}">{{tab_title}}</a></li>
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




<?include(TEMPLATES . 'demographics_panel.html'); ?>
<?include(TEMPLATES . 'encounter_flow.html'); ?>
<?include(TEMPLATES . 'complaint.html'); ?>
<?include(TEMPLATES . 'general_history.html'); ?>
<?include(TEMPLATES . 'paediatric_history.html'); ?>


