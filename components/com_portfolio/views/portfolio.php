<script>
	var patientID = <?=$patientID?>;
	var patientName = '<?=$patientName?>';
    var patientDOB = '<?=$patientDOB?>';
    var patientEmail = '<?=$patientEmail?>';
    var clinician = '<?=$username?>';
    var clinic = <?=$clinic?>;
  
</script>



<!-- start: patient_name -->
<div class="col-sm-12 col-md-12"><!-- Start Left content -->
<?loadModule('patient_name');?>
	
<!-- /patient_name-->
<div class="row">
		<div class="col-sm-12">
			<a href="<?= htmlspecialchars($backLink ?? '#', ENT_QUOTES, 'UTF-8') ?>"
			class="btn btn-default pull-right">
				← Back
			</a>
			<div style="clear: both;"></div>
		</div>
</div>
<div class="row">&nbsp;</div>
<div id="portfolio" class="row">
    <div class="col-lg-12">
    <button class="btn btn-primary btnSelectImages">Select</button>
    <button class="btn btn-danger btnDeleteImages" disabled><i class="fas fa-trash-alt"></i></button>
    <button class="btn btn-primary btnPrintPortfolio actionButton" disabled><i class="fas fa-print"></i></button>
    <button class="btn btn-primary btnEmailPortfolio actionButton" disabled><i class="fas fa-envelope-open-text"></i></button>
     <div id="pictureproof" class="box">       
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




