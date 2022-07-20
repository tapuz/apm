var canvas;

$(function() {
    showLoadingScreen();
    hideLoadingScreen();
    var maxWidth = $( window ).width()-50;
    if (maxWidth > 1300){maxWidth=1300;};
    var canvasWidth = 0;
	var canvasHeight = 0;
    var bgImage;
    var bgImageCurAngle = 0;
	
   

	
    var zoomImg;

    //hide and show
    $( "#canvas-box" ).toggle();
    $( "#portfolio" ).toggle();
    

    //init the canvas
    canvas =  new fabric.Canvas('c', { isDrawingMode: true, backgroundColor :'white', selection: false,allowTouchScrolling: false});
    canvas.setDimensions({width:canvasWidth, height:canvasHeight});
    
    
    //do not delete the line below
    fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';
    //do not delete the line above

    //event handlers

    //set the drawing brush
    canvas.freeDrawingBrush.color = 'red';
    canvas.freeDrawingBrush.width =  5;
    


    $(document).on('click','.img-thumbnail',function(){

        renderBackgroundImage(this.src);
        $( "#canvas-box" ).toggle();
        $( "#thumbnails" ).toggle();
        
    
    });

    $('#clear_drawing').click(function(){
        canvas.getObjects('path').forEach((path) => {
              canvas.remove(path);
          });
    });
    $('#undo').click(function(){
        var paths = canvas.getObjects('path');
        //delete the latest
        canvas.remove(paths[paths.length - 1]);
        
    });
    $('#btn_portfolio').click(function(){
        //clearDrawing();
        canvas.clear();
          $( "#canvas-box" ).toggle();
          $( "#thumbnails" ).toggle();
          $( "#portfolio" ).show();
          $( "#images").hide();         
        });

    $('.toggleImagesPortfolio').click(function() {
        $( "#images" ).toggle();
        $( "#portfolio" ).toggle();
    });
    
    $('#select-image').click(function() {
        canvas.clear();
        $( "#canvas-box" ).toggle();
        $( "#thumbnails" ).toggle();
            
        
            
    });

    $('#print').click(function() {	
       var tempImage = new Image();
           tempImage.id = "tempImage";
           tempImage.height=500;
           //tempImage.width =1100;
           tempImage.src = canvas.toDataURL();
        
        $('#board').append(tempImage);
        //print
        var header = $('#clinicHeader').val() + "<H3>Clinician: " + clinician+ "</H3>" + "<H3>Patient: " +patientName+" ("+patientDOB+")</H3>";
    	$('#tempImage').printThis({header: header});
        //delete the tempImage
        tempImage.remove();
    });

    $('#saveToPatientPortfolio').click(function(){ 
        
        var dataURL = $('#c').get(0).toDataURL('image/jpeg');//have to get the canvas element from the jquery object
        
        log(dataURL);
 
         console.log(patientName);
         $.ajax({
               type: "post",
               url: "ajax.php",
               data: { com: 'educate', 
                       task: 'saveToPatientPortfolio', 
                       imgBase64: dataURL,
                     patientID: patientID,
                     patientName: patientName,
                     patientDOB: patientDOB}
             }).success(function( response ) {
                     //add the image to the portfolio 
                     getPortfolioPictures();
                    
                     Message = new Noty({
                        text: '<span class="text-center">Image saved to portfolio!</span><span class="pull-right"><i class="fa fa-times-circle">&nbsp;</i></span>',
                        //closeWith:'click',
                        layout:'top',
                        theme:'sunset',
                        type:'success',
                        timeout: 1500 
                        
                        }).show();	
                });
    });
     

    //end - envent handlers

    function renderBackgroundImage(source){
    
        fabric.Image.fromURL(source, function (img) {
             
             imgWidth = img.width;
             imgHeight = img.height;
             aspectRatio = imgHeight/imgWidth;
             canvasWidth = maxWidth;
             
             canvasHeight = maxWidth * aspectRatio;
             var scaleFactor = canvasWidth / imgWidth;
    
                 img.set({
                     width: imgWidth, 
                     height: imgHeight, 
                     originX: 'left', 
                     originY: 'top',
                     scaleX: scaleFactor,
                     scaleY: scaleFactor,
                     
                 });
                 canvas.setWidth(canvasWidth);
                 canvas.setHeight(canvasHeight);
                 canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
                 bgImage = img;
             });
    }

    function getPortfolioPictures() {
        //console.log(patientID);
        $.ajax({type: "post", url: "ajax.php", dataType: "json",
          data: { com: 'educate',task: 'getPortfolioPictures', patientID : patientID}
            }).success(function( portfolioPictures ) {
               $('#portfolio_images').empty();
		        console.log(portfolioPictures);
                $.each(portfolioPictures, function(){
                      
                      var div = $('<div>',{class:'col-sm-3 col-xs-6 thumbnail-container'}).html('<img class="img-thumbnail" id="'+ this.image_id +'" src="userdata/portfolio_images/'+ this.filename +'">');
                      $('#portfolio_images').append(div);
                      
	            });
                
		
	        });
       
     }


});