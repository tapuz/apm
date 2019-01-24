<script>
	var patientID = <?=$patientID?>;
	var patientName = '<?=$patientName?>';
	var patientDOB = '<?=$patientDOB?>';
	var clinician = '<?=$username?>'
</script>

<input type="hidden" id="clinicHeader" value="<?=$clinicHeader?>">
<!-- start: patient_name -->
<?loadModule('patient_name');?>
	
<!-- /patient_name-->

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
                        <div class='row with-margin-left'>
                            <div class="btn-toolbar">
                                <button class="btn btn-success" id="select-image">Select new image</button>
                                <button class="btn btn-success" id="btn_portfolio">Portfolio</button>
                                <button class="btn btn-danger"  id="clear_drawing">Clear drawing</button>
                                <button class="btn btn-danger"  id="clear_board">Clear board</button>
                                <button class="btn btn-warning" id="btnAnalyse"><i class="fas fa-draw-polygon"></i></button>
                                <button class="btn btn-warning" id="btnDraw"><i class="fas fa-paint-brush"></i></button>
                                <button class="btn btn-warning" id="btnRotatePlus90"><i class="fas fa-sync-alt"></i></button>
                                <button class="btn btn-primary" id="btnPrint"><i class="fas fa-print"></i></button>
                                <button class="btn btn-primary" id="btnSaveToPatientPortfolio"><i class="far fa-save"></i> Save to porfolio</button>
                            </div>
                        </div>
                        <div class="spacer5"></div>
                         <div class='row with-margin-left toolbar draw'>
                            <div class="btn-toolbar">
                                <button class="btn btn-success" id="bnt">DrawOption</button>
                                
                            </div>
                        </div>
                        <div class="spacer5"></div>
                        <div class='row with-margin-left toolbar analyse'>
                            <div class="form-inline">
                                <button class="btn btn-warning" id="btnAnalyseX">X analyse</button>
                                <button class="btn btn-warning" id="btnAnalyseY">Y analyse</button>
                                

                                <div class="form-group">
                                    
                                    <input type="text" class="form-control" id="patientHeight" placeholder="Patient Height">
                                </div>
                               
                                
                            </div>
                            <!--<div class="form-inline">
                                
                                <input class="form-control" typ="text">
  
                            </div>-->
                        </div>                
                    </div>
                </div>
                <div class="row">&nbsp;</div>
                <div class="row">
                    
                    <div id="canvas-col" class="col-lg-12">
						<div id="board">
                            <canvas id="c" style="border:1px solid black;" ></canvas>
                            <!--<canvas id="zoom" style="border:1px solid black;" ></canvas>-->
                            
						</div>
					</div>
                </div>
            </div>
        </div>
    </div>
</div><!-- end row -->




