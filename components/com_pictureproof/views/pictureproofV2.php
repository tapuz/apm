<script>
	var patientID = <?=$patientID?>;
	var patientName = '<?=$patientName?>';
	var patientDOB = '<?=$patientDOB?>';
	var clinician = '<?=$username?>'
</script>

<input type="hidden" id="clinicHeader" value="<?=$clinicHeader?>">
<!-- start: patient_name -->
<div class="col-sm-12 col-md-12"><!-- Start Left content -->
<?loadModule('patient_name');?>
	
<!-- /patient_name-->

<div id="thumbnails" class="row">
    <div class="col-lg-12">
        <div id="images" class="box">
            
				<div class="box-header">
					<h2>
                    <span><i class="icon-picture"></i><span class="break"></span>Camera pictures</span>
                    
                    </h2>
                    <button class="btn btn-primary" id="btn_refresh_camera_pictures"><i class="fa fa-refresh"></i></button>


                   
					<div class="box-icon">
                        
                        
						<button class="btn btn-primary toggleImagesPortfolio">Portfolio</button>
					</div>
				</div>
			
				<div class="box-content">
                <div class ="row"></div>
                    
                    <button class="btn btn-primary btnSelectImages">Select</button>
                    <button class="btn btn-danger btnDeleteImages" disabled><i class="fas fa-trash-alt"></i></button>
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
                                <button class="btn btn-warning" id="btnHideEyes"><i class="fas fa-eye-slash"></i></button>
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
                                <button class="btn-lg btn-warning" id="btnAnalyseX"><i class="fas fa-arrows-alt-v"></i></button>
                                <button class="btn-lg btn-warning" id="btnAnalyseY"><i class="fas fa-arrows-alt-h"></i></button>
                                <button class="btn-lg btn-warning" id="btnAnalyseSpine"><i class="fas fa-ellipsis-v"></i></button>
                                

                                <div class="form-group">
                                    
                                    <input type="text" class="form-control" id="patientHeight" placeholder="Patient Height" value="<?=$height?>">
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
                            <canvas id="c" style="border:2px solid black;" ></canvas>
                            <!--<canvas id="zoom" style="border:1px solid black;" ></canvas>-->
                            
						</div>
					</div>
                </div>
            </div>
        </div>
    </div>
</div><!-- end row -->
</div>




