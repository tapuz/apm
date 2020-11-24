
<!-- start: Search Patient -->
	<div class="col-lg-5 col-md-5">
		<div class="form-group">
			<label class="control-label" for="search-patient">
				Search patient
			</label>
			<div class="controls">
				<div class="input-group">
					<input id="search-patient" class="form-control" size="6" type="text" placeholder="Search patient...">
					<span class="input-group-btn">
						<button class="btn" type="button">
							Search
						</button>
					</span>
				</div>
			</div>
		</div>
		
		<div class="row">
		<div id="results">
			</div>
		</div><!--/row-->
		
		
		

	</div> <!--/col left content-->
	
	

<!--/Search Patient-->
<script id='tmpl_patient_search_results' type="x-tmpl-mustache">
   <div class="patients_search_results"> 
    <ul>
        {{#patients}}
			<li class="patient" patient_id="{{patient_id}}"><a href="#"><i class="fa fa-user">&nbsp;&nbsp;</i><span> {{patient_surname}} {{patient_firstname}}</span></i> <a target="{{patient_id}}" href="index.php?com=patient&view=patient&patient_id={{patient_id}}"><span class="open_file pull-right"><i class="fa fa-file-text-o" aria-hidden="true"></i> Open file</span></a></li>
        {{/patients}}
    <ul>
    </div>



</script>




   








   







