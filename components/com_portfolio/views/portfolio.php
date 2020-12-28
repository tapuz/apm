<script>
	var patientID = <?=$patientID?>;
	var patientName = '<?=$patientName?>';
	var patientDOB = '<?=$patientDOB?>';
    var clinician = '<?=$username?>';
    var clinic = <?=$clinic?>;
  
</script>



<!-- start: patient_name -->
<div class="col-sm-12 col-md-12"><!-- Start Left content -->
<?loadModule('patient_name');?>
	
<!-- /patient_name-->

<div id="portfolio" class="row">
    <div class="col-lg-12">
    <button class="btn btn-primary btnSelectImages">Select</button>
    <button class="btn btn-danger btnDeleteImages" disabled><i class="fas fa-trash-alt"></i></button>
    <button class="btn btn-primary btnGeneratePDF" disabled><i class="fas fa-print"></i></button>
        <div id="images" class="box">
            
				<div class="box-header">
					<h2>
                    <span><i class="icon-picture"></i><span class="break"></span>PictureProof</span>
                    
                    </h2>
                  
					<div class="box-icon">
                        		
					</div>
				</div>
			
				<div class="box-content">
                    <div class="row" id="pictureproofImages"></div>
                </div>
                    
        </div>
		<div id="portfolio" class="box">
			<div class="box-header">
					<h2><i class="icon-picture"></i><span class="break"></span>Educate</h2>
					<div class="box-icon">
					
					</div>
				</div>
            <div class="box-content">
                <div class="row" id="educateImages">
				    
                </div>
            </div>
        </div>
    </div>
</div><!-- end row -->




</div>




