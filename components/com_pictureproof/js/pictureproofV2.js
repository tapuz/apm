$(function() {
    var maxWidth = 1000;
    var canvasWidth = 0;
	var canvasHeight = 0;
    var bgImage;
    var bgImageCurAngle = 0;
	
    var topBar = 0;
    var bottomBar;
	var topbarY = 0;
	var bottombarY = 0;
    var heightBarsPresent = false;
    
    var groupPaths;

	var patientHeight;
	var cpp;  //centimeters Per Pixel
	var deltaLimit = 5; //absolute value difference greater than this will become red

    var zoomImg;

    //var socket = io("https://192.168.0.2:3000");

     // Active



    window.addEventListener('focus', setActivePatient);

    function setActivePatient(){
        $.ajax({
            url: "ajax.php",
            type: 'post',
            data: {
              com: 'patient',
              task: 'set_active_patient',
              patient: patientID
            },
            success: function(data) {
              //
            }
           });
          }
                    
    
    
    //minify the main menu
	$('#main-menu-min').click ();
    //hide the toolbars
    $('.toolbar').toggle();
    //get the camera pictures
    getCameraPictures(); 
    // get the portfolio pictures
    getPortfolioPictures();
    
    var canvas =  new fabric.Canvas('c', { isDrawingMode: false, backgroundColor :'white', selection: false,allowTouchScrolling: true});
    canvas.setDimensions({width:canvasWidth, height:canvasHeight});
    
    groupPaths = new fabric.Group();
    

    canvas.on('path:created', function(e){
        var newPath = e.path;
        groupPaths.add(newPath);
    });
    


	//do not delete the line below
    fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';
    //do not delete the line above
    
    //hide the canvas and portfolio
    $( "#canvas-box" ).toggle();
    $( "#portfolio" ).toggle();
    
    //render the height bars
    

    //START ANALYSE AP-PA//
     function calcCPP() {
        patientHeight = $('#patientHeight').val();
		cpp = patientHeight/(bottomBar.get('top')-topBar.get('top'));
		log('cpp = ' + cpp);
	 }
	 
	 
	 
     function makeCircleAP(left, top, line1, line2, line3, line4,deltaText,hasDeltaText) {
		
        var c = new fabric.Circle({
        left: left,
        top: top,
        strokeWidth: 5,
        radius: 12,
        fill: 'rgba(0,0,0,0)',
        stroke: '#666'
        });
        
        c.hasControls = c.hasBorders = false;
        c.line1 = line1;
        c.line2 = line2;
        c.line3 = line3;
        c.line4 = line4;
		c.deltaText = deltaText;
		c.hasDeltaText = hasDeltaText;
		
        c.on('mousedown', function () {
            var pointer = canvas.getPointer(event.e);
            var posx = pointer.x;
            var posy = pointer.y;
            
            });
        
		c.on('moving', function() {

                
	
				c.line1 && c.line1.set({ 'x2': c.left, 'y2': c.top });
				c.line2 && c.line2.set({ 'x1': c.left, 'y1': c.top });	
				c.line3 && c.line3.set({ 'x1': c.left, 'y1': c.top });
				c.line4 && c.line4.set({ 'x1': c.left, 'y1': c.top });
				
				var delta;
	
				
					if (c.hasDeltaText === true) {
						c.deltaText.set({ 'left': c.left + 45, 'top': c.top });
						delta = c.line1.get('y1') - c.line1.get('y2');
					} else {
						delta = c.line2.get('y1') - c.line2.get('y2');	
						
					}
				var text = c.deltaText._objects[0];
				//calculate cm delta from pixels
				calcCPP();
				delta = cpp * delta;
				delta = delta.toFixed(2);
				
				text.setText(delta.toString());
				if (Math.abs(delta) > deltaLimit) {
					text.textBackgroundColor = "red";
				} else {
					text.textBackgroundColor = "green";
				}
				
			
			});
		
		
        return c;

     }

     function makeCircleLAT(left, top, line1, line2, line3, line4,deltaText,hasDeltaText) {
		
        var c = new fabric.Circle({
        left: left,
        top: top,
        strokeWidth: 5,
        radius: 12,
        fill: 'rgba(0,0,0,0)',
        stroke: '#666'
        });
        
        c.hasControls = c.hasBorders = false;
        c.line1 = line1;
        c.line2 = line2;
        c.line3 = line3;
        c.line4 = line4;
		c.deltaText = deltaText;
		c.hasDeltaText = hasDeltaText;
		
        c.on('mousedown', function () {
            var pointer = canvas.getPointer(event.e);
            var posx = pointer.x;
            var posy = pointer.y;
            
            });
        
		c.on('moving', function() {

                
	
				c.line1 && c.line1.set({ 'x2': c.left, 'y2': c.top });
				c.line2 && c.line2.set({ 'x1': c.left, 'y1': c.top });	
				c.line3 && c.line3.set({ 'x1': c.left, 'y1': c.top });
				c.line4 && c.line4.set({ 'x1': c.left, 'y1': c.top });
				
				var delta;
	
				
					if (c.hasDeltaText === true) {
						c.deltaText.set({ 'left': c.left + 45, 'top': c.top });
						delta = c.line1.get('x1') - c.line1.get('x2');
					} else {
						delta = c.line2.get('x1') - c.line2.get('x2');	
						
					}
				var text = c.deltaText._objects[0];
				//calculate cm delta from pixels
				calcCPP();
				delta = cpp * delta;
				delta = delta.toFixed(2);
				
				text.setText(delta.toString());
				if (Math.abs(delta) > deltaLimit) {
					text.textBackgroundColor = "red";
				} else {
					text.textBackgroundColor = "green";
				}
				
			
			});
		
		
        return c;

     }
	 
	 
	 
     
     function makeLine(coords,color,strokeWidth,selectable) {
         return new fabric.Line(coords, {
           fill: color,
           stroke: color,
           strokeWidth: strokeWidth,
           selectable: selectable,
		   hasControls : false
         });
     }
	 
	 
	 function makeYMeasureBar(left,top,length) {
		
		
		var lijn = makeLine([ left, top, left+length, top ],'red',2,false);
		
		var text = new fabric.Text((0).toString(),
								{selectable: false,
								 left: lijn.get('x2')+30, 
								 top: lijn.get('y2'),
								 fontSize: 20,
								 backgroundColor : 'green',
								 fill: 'white',
                                 
								 });
        text.setVisible(true);
		

		var rect = new fabric.Rect({width: 100, height: 20, left: lijn.get('x2')+30, top: lijn.get('y2'), fill: 'red'});
		var textGroup = new fabric.Group([text], {selectable: false, left: lijn.get('x2')+45, top: lijn.get('y2')});
		 
      
		canvas.add(textGroup);
		
		var circle1 = makeCircleAP(left,top,null,lijn,null,null,textGroup,false);
		var circle2 = makeCircleAP(left+length,top,lijn,null,null,null,textGroup,true);
		
		canvas.add(lijn);
		canvas.add(circle1);
		canvas.add(circle2);
		
	
		canvas.renderAll();
		
		
     }

     function makeXMeasureBar(left,top,length) {
		
		
		var lijn = makeLine([ left, top, left, top+length ],'green',2,false);
		
		var text = new fabric.Text((0).toString(),
								{selectable: false,
								 left: lijn.get('x2')+30, 
								 top: lijn.get('y2'),
								 fontSize: 20,
								 backgroundColor : 'green',
								 fill: 'white',
                                 
								 });
        text.setVisible(true);
		

		var rect = new fabric.Rect({width: 100, height: 20, left: lijn.get('x2')+30, top: lijn.get('y2'), fill: 'red'});
		var textGroup = new fabric.Group([text], {selectable: false, left: lijn.get('x2')+45, top: lijn.get('y2')});
		 
      
		canvas.add(textGroup);
		
		var circle1 = makeCircleLAT(left,top,null,lijn,null,null,textGroup,false);
		var circle2 = makeCircleLAT(left,top+length,lijn,null,null,null,textGroup,true);
		
		canvas.add(lijn);
		canvas.add(circle1);
		canvas.add(circle2);
		
	
		canvas.renderAll();
		
		
     }
     
     

	 
	function makePatientHeightBars() {
		
		 topBar =  new fabric.Line([0,30,canvasWidth,30], {fill: 'blue',stroke: 'blue',strokeWidth: 3,selectable: true,hasControls : false});
		 //topbarY = topbar.get('top'); 
		 topBar.on('modified', function() {
			//topbarY = topbar.get('top'); //use top instead of get('y1'), x and y are coords of bounding box.. not of the actual line
			calcCPP();
			//log(topbar.get('top'));
			
		});
		 
		 bottomBar =  new fabric.Line([0,canvasHeight-30,canvasWidth,canvasHeight-30], {fill: 'blue',stroke: 'blue',strokeWidth: 3,selectable: true,hasControls : false});
		 //bottombarY = bottombar.get('top'); 
		 bottomBar.on('modified', function() {
			//bottombarY = bottombar.get('top');
			calcCPP();
			//log(bottombarY);
			
		});
        
        

		canvas.add(topBar);
		canvas.add(bottomBar);
        canvas.renderAll();
        heightBarsPresent = true;
        
	}
	
	 

    
    canvas.on('object:moving', function (e) {
		var obj = e.target;
		 // if object is too big ignore
		if(obj.currentHeight > obj.canvas.height || obj.currentWidth > obj.canvas.width){
			return;
		}        
		obj.setCoords();        
		// top-left  corner
		if(obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0){
			obj.top = Math.max(obj.top, obj.top-obj.getBoundingRect().top);
			obj.left = Math.max(obj.left, obj.left-obj.getBoundingRect().left);
		}
		// bot-right corner
		if(obj.getBoundingRect().top+obj.getBoundingRect().height  > obj.canvas.height || obj.getBoundingRect().left+obj.getBoundingRect().width  > obj.canvas.width){
			obj.top = Math.min(obj.top, obj.canvas.height-obj.getBoundingRect().height+obj.top-obj.getBoundingRect().top);
			obj.left = Math.min(obj.left, obj.canvas.width-obj.getBoundingRect().width+obj.left-obj.getBoundingRect().left);
		}
	});
    
    
    //END ANALYSE AP-PA//
    
    
    $('.img-thumbnail').live('click', function() {  
            renderBackgroundImage(this.src);
            
   
        $( "#canvas-box" ).toggle();
        $( "#thumbnails" ).toggle();
    });


//button actions
    //top toolbar
    $('#btnAnalyse').click(function() {
       $(this).toggleClass('active'); 
       $('.toolbar.analyse').toggle();
       if(!heightBarsPresent){makePatientHeightBars();};
       if ($(this).hasClass('active')){bottomBar.setVisible(true);topBar.setVisible(true);log('visible')}
       else{bottomBar.setVisible(false);topBar.setVisible(false);}

       if($(this).hasClass('active') && $('#btnDraw').hasClass('active')){$('#btnDraw').click();}
       

       canvas.renderAll();
       
    });

     $('#btnDraw').click(function() {
       $(this).toggleClass('active'); 
       $('.toolbar.draw').toggle();
       //start drawing
       if($(this).hasClass('active') && $('#btnAnalyse').hasClass('active')){$('#btnAnalyse').click();}
       //if($(this).hasClass('active')){canvas.isDrawingMode = true;}else{canvas.isDrawingMode = false;}
       canvas.isDrawingMode = !canvas.isDrawingMode;

       

        
    });

    $('#btnRotatePlus90').click(function() {
        log (canvas.getWidth());
        rotateObject(bgImage,bgImageCurAngle + 1.5708,bgImage.width/2,bgImage.height/2);
        bgImageCurAngle += 1.5708;  
        //canvas.setWidth(canvasHeight);
        //canvas.setHeight(canvasWidth);
        //canvasHeight = canvas.getWidth();
        //canvasWidth = canvas.getHeight();
        
        canvas.renderAll();
    });

    $('#btnRotateMin90').click(function() {
        rotateObject(bgImage,-1.5708,bgImage.width/2,bgImage.height/2);
        canvas.renderAll();
    });

    $('#btnRotate180').click(function() {
        rotateObject(bgImage,3.14159,bgImage.width/2,bgImage.height/2);
        canvas.renderAll();
    });

    //analyse toolbar
    $('#btnAnalyseY').click(function() {
		makeYMeasureBar((canvasWidth/2)-150,200,400);
    });

    $('#btnAnalyseX').click(function() {
        makeXMeasureBar(canvasWidth/2,200,300);
    });
    
    

    



    //draw toolbar

//end button actions
    $('#select-image').click(function() {
        $( "#canvas-box" ).toggle();
        $( "#thumbnails" ).toggle();
        
        clearDrawing();
        clearImage();
        clearTempLayer();
    });
        
    $('.toggleImagesPortfolio').click(function() {
        $( "#images" ).toggle();
        $( "#portfolio" ).toggle();
    });
    


    
    $('#btnSaveToPatientPortfolio').click(function(){ 
       var dataURL = $('#c').get(0).toDataURL('image/jpeg');//have to get the canvas element from the jquery object
       log(dataURL);
        console.log(patientName);
        $.ajax({
  			type: "post",
		    url: "ajax.php",
  			data: { com: 'pictureproof', 
  					task: 'saveToPatientPortfolio', 
  					imgBase64: dataURL,
                    patientID: patientID,
                    patientName: patientName,
                    patientDOB: patientDOB}
			}).success(function( response ) {
                    //add the image to the portfolio 
                	getPortfolioPictures();
                    console.log('image_added');
					var n = noty({text: 'Saved to Patient Portfolio',type: 'success',layout:'topRight'});  				
			});
        });
    
    $('#btnPrint').click(function() {	
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
    
    $('#clear_drawing').click(function(){
        clearDrawing();
        });
    
    $('#clear_board').click(function(){
        clearDrawing();
        clearImage();
        });

    
    $('#btn_portfolio').click(function(){
        //clearDrawing();
          $( "#canvas-box" ).toggle();
          $( "#thumbnails" ).toggle();
          $( "#portfolio" ).show();
          $( "#images").hide();         
        });
    
    $('#btn_refresh_camera_pictures').click(function(){
        console.log('refreshing');
       getCameraPictures(); 
    });
    
    function clearImage(){
         // Clears the image
        imgLayerCtx = $("#imgLayer")[0].getContext("2d");
        imgLayerCtx.clearRect(0, 0, imgLayerCtx.canvas.width, imgLayerCtx.canvas.height);
        imgLayerCtx.fillStyle = "white";
        imgLayerCtx.fillRect(0,0,canvasWidth,canvasHeight);
    }
    
    function clearDrawing(){
        drawingLayerCtx = $("#drawingLayer")[0].getContext("2d");
        drawingLayerCtx.clearRect(0, 0, drawingLayerCtx.canvas.width, drawingLayerCtx.canvas.height);
        
        clickX = new Array();
        clickY = new Array();
        clickDrag = new Array();
        redraw();
    }
    
    function clearTempLayer(){
        tempLayerCtx = $("#tempLayer")[0].getContext("2d");
        tempLayerCtx.clearRect(0, 0, tempLayerCtx.canvas.width, tempLayerCtx.canvas.height);
    }
    
     function getCameraPictures() {
        console.log(patientID);
        $.ajax({type: "post", url: "ajax.php", dataType: "json",
          data: { com: 'pictureproof',task: 'getCameraPictures', patientID : patientID}
            }).success(function( cameraPictures ) {
               $('#cameraPictures').empty();
		        console.log(cameraPictures);
                $.each(cameraPictures, function(){
                      console.log(this.filename);
                      var div = $('<div>',{class:'col-sm-3 col-xs-6 thumbnail-container'}).html('<img class="img-thumbnail" id="'+ this.image_id +'" src="userdata/camera_pictures/'+ this.filename +'">');
                      $('#cameraPictures').append(div);
                      
	            });
                
		
	        });
       
     }
     
     function getPortfolioPictures() {
        console.log(patientID);
        $.ajax({type: "post", url: "ajax.php", dataType: "json",
          data: { com: 'pictureproof',task: 'getPortfolioPictures', patientID : patientID}
            }).success(function( portfolioPictures ) {
               $('#portfolioPictures').empty();
		        console.log(portfolioPictures);
                $.each(portfolioPictures, function(){
                      
                      var div = $('<div>',{class:'col-sm-3 col-xs-6 thumbnail-container'}).html('<img class="img-thumbnail" id="'+ this.image_id +'" src="userdata/portfolio_images/'+ this.filename +'">');
                      $('#portfolioPictures').append(div);
                      
	            });
                
		
	        });
       
     }

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

 function rotateObject(fabObj, angleRadian, pivotX, pivotY) {
    ty = pivotY - fabObj.height / 2.0;
    tx = pivotX - fabObj.width / 2.0;
    if (angleRadian >= Math.PI * 2) {
        angleRadian -= Math.PI * 2;
    }
    angle2 = Math.atan2(ty, tx);
    angle3 = (2 * angle2 + angleRadian - Math.PI) / 2.0;
    pdist_sq = tx * tx + ty * ty;
    disp = Math.sqrt(2 * pdist_sq * (1 - Math.cos(angleRadian)));
    fabObj.set({transformMatrix:[
        Math.cos(angleRadian),
        Math.sin(angleRadian),
       -Math.sin(angleRadian),
        Math.cos(angleRadian),
        disp * Math.cos(angle3),
        disp * Math.sin(angle3)
    ]});
    }
     
    
    
    
    
    
    
    
});







