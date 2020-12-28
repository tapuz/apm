<div class="col-sm-12 col-md-9"><!-- Start Left content -->
	
	<!-- start: patient_name -->
	<?loadModule('patient_name');?>
	
	<!-- /patient_name-->
	<div class="row">
		
		<label class="control-label" for="name">Name</label>
    	<input type="text" class="form-control" name="name" id="name" placeholder="Enter letter name" value="<?=$letter->name?>"  />
    	<label class="control-label" for="note">Note</label>
    	<input type="text" class="form-control" name="note" id="note" placeholder="Internal note" value="<?=$letter->note?>" />
		<label class="control-label" for="clinic">Clinic</label>
    	<select class="form-control" id="clinic" name="clinic">
			<?
			foreach($clinics as $clinic) {
				if ($clinic->clinic_id == $letter->clinic_id) {
					echo sprintf('<option clinic_id ="%s" value="%s" selected>%s</option>',$clinic->clinic_id,$clinic->clinic_id,$clinic->clinic_name);
				} else {
					echo sprintf('<option clinic_id ="%s" value="%s">%s</option>',$clinic->clinic_id,$clinic->clinic_id,$clinic->clinic_name);
				}
			}
			?>
		</select>
	</div>
	<div class="row">&nbsp;</div>
	<div class="row">
		<div class="pull-right">
		<button onclick="saveLetter();" type="button" class="btn btn-primary saveLetter">Save</button>
		<button onclick="printLetter();" type="button" class="btn btn-primary">Print</button>
		</div>	
	</div>
	<div class="row">
		
		<?editorToolbar();?>
		
	</div>
	<div class="row">&nbsp;</div>
	<div class="row" id="letter">
		<div id='editor'>
		<?=$letter_body?>	
		
		
		</div>
		
		
	
	</div><!--/row-->

</div><!--/col /left content -->

<div class="col-md-3 visible-md visible-lg" id="feed"><!-- Start Right content -->
	<h2>Templates</h2>
	<ul class="nav main-menu">
			
		<?foreach ($templates as $template)
     				{?>		
					          
					<li><a href="#" class="load_template" template_id = "<?=$template->id?>"><?=$template->name?></a></li>  
    			
			    <? }?>
		      
    </ul>

</div><!--/col /Right Content-->

</div><!--/row-->  
  
  
    	
    
   
	
	 
	
	



<input type="hidden" id="letter_id" value="<?=$letter_id?>">
<input type="hidden" id="patient_id" value="<?=$patient->patient_id?>">
<input type="hidden" id="user_id" value="<?=$user->ID?>">
<input type="hidden" id="clinic_logo" value="<?=$clinic->clinic_logo?>">
<input type="hidden" id="clinic_letter_heading" value="<?=$clinic->clinic_letter_heading?>">
<script>
$('#editor').wysiwyg();
</script>

