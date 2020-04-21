<script>
	var patientID = <?=$patientID?>;
	var patientName = '<?=$patientName?>';
	var patientDOB = '<?=$patientDOB?>';
	var clinician = '<?=$username?>'
</script>

<input type="hidden" id="clinicHeader" value="<?=$clinicHeader?>">

<?loadModule('patient_name');?>
<div id="thumbnails" class="row">
    <div class="col-lg-12">
	
        <div id="images" class="box">
            
				<div class="box-header">
					<h2><i class="icon-picture"></i><span class="break"></span>Image library</h2>
					<div class="box-icon">
								
								
								<button class="btn btn-primary toggleImagesPortfolio">Portfolio</button>
					</div>
				</div>
			
				<div class="box-content">
                <div class="row">
                    <div style="margin-bottom:30px" class="col-sm-3 col-xs-6">
						<img id="photo1" class="img-thumbnail" src="userdata/educate_images/Dermatome.jpg" alt="Sample Image">
					</div>
                    <div style="margin-bottom:30px" class="col-sm-3 col-xs-6">
						<img id="photo2" class="img-thumbnail" src="userdata/educate_images/LSTS1.jpg" alt="Sample Image">
					</div>
                    <div style="margin-bottom:30px" class="col-sm-3 col-xs-6">
						<img id="photo3" class="img-thumbnail" src="userdata/educate_images/LSTS2.jpg" alt="Sample Image">
					</div>
                    <div style="margin-bottom:30px" class="col-sm-3 col-xs-6">
						<img id="photo4" class="img-thumbnail" src="userdata/educate_images/LSTS3.jpg" alt="Sample Image">
					</div>
                    <div style="margin-bottom:30px" class="col-sm-3 col-xs-6">
						<img class="img-thumbnail" src="userdata/educate_images/Sciatica.jpg" alt="Sample Image">
					</div>
                    <div style="margin-bottom:30px" class="col-sm-3 col-xs-6">
						<img class="img-thumbnail" src="userdata/educate_images/Spine-Graphic.jpg" alt="Sample Image">
					</div>
                    
                    
                </div>
            </div>
        </div>
		<div id="portfolio" class="box">
			<div class="box-header">
					<h2><i class="icon-picture"></i><span class="break"></span>Portfolio</h2>
					<div class="box-icon">
					<button class="btn btn-primary toggleImagesPortfolio">Images</button>
					</div>
				</div>
            <div class="box-content">
                <div class="row" id="portfolio_images">
					 <?foreach ($images as $image) 
     				{?>
						<div style="margin-bottom:30px" class="col-sm-3 col-xs-6">
						<img id="<?=$image->image_id?>" class="img-thumbnail" src="userdata/portfolio_images/<?=$image->filename?>" alt="portfolio_image">
						</div>
					<?}?>
                                      
                    
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
                        <button class="btn btn-success" id="select-image">Select new image</button>
						<button class="btn btn-success" id="btn_portfolio">Portfolio</button>
                        <button class="btn btn-primary" id="saveToPatientPortfolio"><i class="far fa-save"></i> Save to Portfolio</button>
                        <button class="btn btn-primary" id="print"><i class="fas fa-print"></i></button>
                        <button class="btn btn-danger"  id="clear_drawing">Clear drawing</button>
						<button class="btn btn-warning" id="undo"><i class="fas fa-undo-alt"></i></button>
						
                        
                    </div>
                </div>
                <div class="row">
                    
                    <div id="canvas-col" class="col-lg-12">
						<div id="board">
							<canvas id="c"></canvas>
						</div>
					</div>
                </div>
            </div>
        </div>
    </div>
</div><!-- end row -->




