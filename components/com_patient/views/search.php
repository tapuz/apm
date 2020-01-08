
<!-- start: Search Patient -->
	<div class="col-lg-5 col-md-5">
		<div class="form-group">
			<label class="control-label" for="search-patient">
				Search patient...
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




   


<div class="col-md-4 visible-md visible-lg" id="feed" style="display:none;"><!-- Start Right content -->
<!--start right menu -->
	<h2>Patients for Today <a class="icon-repeat"></a></h2>
		<ul class="nav main-menu blue"> <!-- the blue class is specified in com_patients/css/search.css-->
			<?foreach ($patients_for_today as $patient_for_today) 
     				{?>
					<li class="">
						<a  href="index.php?com=patient&view=patient&patient_id=<?=$patient_for_today->patient_id?>">
						
						<?=$patient_for_today->patient_surname . " " . $patient_for_today->patient_firstname?></a>
							
							
					</li>	
				
				
		           
    			
			    <? }?>
			
			
			
			</ul>
		
			
			
			
					
		
					
				
	
	
	
	
	
	
					
	<!--/right menu -->
	

</div><!--/col /Right Content-->









   


<div class="col-md-4 visible-md visible-lg" id="feed"><!-- Start Right content -->
<!--start right menu -->
	<h2>Patients for Today <a class="icon-repeat"></a></h2>
		<ul class="nav main-menu blue"> <!-- the blue class is specified in com_patients/css/search.css-->
			<?foreach ($patients_for_today as $patient_for_today) 
     				{?>
					<li class="">
						<a  href="index.php?com=patient&view=patient&patient_id=<?=$patient_for_today->patient_id?>">
						
						<?=$patient_for_today->patient_surname . " " . $patient_for_today->patient_firstname?></a>
							
							
					</li>	
				
				
		           
    			
			    <? }?>
			
			
			
			</ul>
		
			
			
			
					
		
					
				
	
	
	
	
	
	
					
	<!--/right menu -->
	

</div><!--/col /Right Content-->




