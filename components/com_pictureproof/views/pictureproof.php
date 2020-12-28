<script>
	var patientID = <?=$patientID?>;
	var patientName = '<?=$patientName?>';
	var patientDOB = '<?=$patientDOB?>';
	var clinician = '<?=$username?>'
</script>

<input type="hidden" id="clinicHeader" value="<?=$clinicHeader?>">


<div id="thumbnails" class="row">
    <div class="col-lg-12">
        <div id="images" class="box">
            
				<div class="box-header">
					<h2><i class="icon-picture"></i><span class="break"></span>Camera pictures</h2>
					<div class="box-icon">
						<a href="#refresh" class="" id="btn_refresh_camera_pictures"><i class="fa fa-refresh"></i></a>
						<button class="btn btn-primary toggleImagesPortfolio">Portfolio</button>
					</div>
				</div>
			
				<div class="box-content">
                <div class="row" id="cameraPictures">
                  <i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>
                  <span class="sr-only">Loading...</span> 
                    
                </div>
            </div>
        </div>
		<div id="portfolio" class="box">
			<div class="box-header">
					<h2><i class="icon-picture"></i><span class="break"></span>Portfolio</h2>
					<div class="box-icon">
					<button class="btn btn-primary toggleImagesPortfolio">Camera Pictures</button>
					</div>
				</div>
            <div class="box-content">
                <div class="row" id="portfolioPictures">
				    
                </div>
            </div>
        </div>
    </div>
</div><!-- end row -->



<div class="row">
    <div class="col-lg-12"><!-- Start Canvas -->
        <div id="canvas-box" class="">
            <div class="">
                <div class="row">
                    <div class="col-lg-12">
                        <button class="btn btn-primary" id="select-image">Select new image</button>
                        <button class="btn btn-primary" id="saveToPatientPortfolio">Save to Portfolio</button>
                        <button class="btn btn-primary" id="print">Print</button>
                        <button class="btn btn-primary" id="clear_drawing">Clear drawing</button>
						<button class="btn btn-primary" id="clear_board">Clear board</button>
						<button class="btn btn-primary" id="btn_portfolio">Portfolio</button>
                        
                    </div>
                </div>
                <div class="row">
                    
                    <div id="canvas-col" class="col-lg-12">
						<div id="board">
						</div>
					</div>
                </div>
            </div>
        </div>
    </div>
</div><!-- end row -->




