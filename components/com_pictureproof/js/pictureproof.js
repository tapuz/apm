$(function() {
  showLoadingScreen();
  hideLoadingScreen();
    var maxWidth = $( window ).width()-60;
    if (maxWidth > 1300){maxWidth=1300;};
    var canvasWidth = 0;
	  var canvasHeight = 0;
    var bgImage;
    var bgImageCurAngle = 0;
	
    var topBar = 0;
    var bottomBar;
    var topBarC;
    var bottomBarC;
	  var topbarY = 0;
	  var bottombarY = 0;
    var heightBarsPresent = false;
    var analyseGroups = [];
    var blackBoxes = [];
    
    var groupPaths;
    var objectsDrawn = [];
    var color = '#e606ea';
    var thickness = 5;
    var isDrawing = false;



	  var patientHeight;
	  var cpp;  //centimeters Per Pixel
	  var deltaLimit = 0.4; //absolute value difference greater than this will become red
    var analyseToolColor = 'rgb(255,0,255)';//pink

    var zoomImg;

    var selectImageMode = false;
    var selectedImages = [];

    //var socket = io("https://192.168.0.2:3000");

     // Active



    window.addEventListener('focus', setActivePatient);
    setActivePatient();

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
                    
    
    //hide some buttons
    $('.btnDeleteImages').hide();


    //minify the main menu
	$('#main-menu-min').click ();
    //hide the toolbars
    $('.toolbar').toggle();
    //get the camera pictures
    getCameraPictures(); 
    // get the portfolio pictures
    getPortfolioPictures();
    
    var canvas =  new fabric.Canvas('c', { isDrawingMode: false, backgroundColor :'white', selection: false,allowTouchScrolling: false});
    canvas.setDimensions({width:canvasWidth, height:canvasHeight});
    
    groupPaths = new fabric.Group();
    

    canvas.on('path:created', function(e){
        var newPath = e.path;
        if (isDrawing) {
          objectsDrawn.push(e.path);
        }
        //groupPaths.add(newPath);

    });
    
    canvas.on({
        'object:selected': onObjectSelected,
        'object:moving': onObjectMoving,
        'before:selection:cleared': onBeforeSelectionCleared
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
	  }
	 
	 
	 
     function makeCircleAP(left, top, line1, line2, line3, line4,deltaText,hasDeltaText) {
		
        var c = new fabric.Circle({
        left: left,
        top: top,
        strokeWidth: 5,
        radius: 20,
        fill: 'rgba(0,0,0,0)',
        stroke: 'rgb(255,0,255)'
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
						c.deltaText.set({ 'left': c.left + 55, 'top': c.top });
						delta = c.line1.get('y1') - c.line1.get('y2');
					} else {
						delta = c.line2.get('y1') - c.line2.get('y2');	
						
					}
				var text = c.deltaText._objects[0];
				//calculate cm delta from pixels
				calcCPP();
				delta = cpp * delta;
				delta = delta.toFixed(2);
				
				//text.setText(delta.toString());
        text.set('text',delta.toString());
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
        radius: 20,
        fill: 'rgba(0,0,0,0)',
        stroke: analyseToolColor
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
						c.deltaText.set({ 'left': c.left + 55, 'top': c.top });
						delta = c.line1.get('x1') - c.line1.get('x2');
					} else {
						delta = c.line2.get('x1') - c.line2.get('x2');	
						
					}
				var text = c.deltaText._objects[0];
				//calculate cm delta from pixels
				calcCPP();
				delta = cpp * delta;
				delta = delta.toFixed(2);
				
				//text.set(delta.toString());
        text.set('text',delta.toString());
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
		
		
		var lijn = makeLine([ left, top, left+length, top ],analyseToolColor,2,false);
		
		var text = new fabric.Text((0).toString(),
								{selectable: false,
								 left: lijn.get('x2')+30, 
								 top: lijn.get('y2'),
								 fontSize: 20,
								 backgroundColor : 'green',
								 fill: 'white'
                                 
								 });
        
        text.visible = true;
		

		var rect = new fabric.Rect({width: 100, height: 20, left: lijn.get('x2')+30, top: lijn.get('y2'), fill: 'red'});
		var textGroup = new fabric.Group([text], {selectable: false, left: lijn.get('x2')+45, top: lijn.get('y2')});
		 
      
		
		
		var circle1 = makeCircleAP(left,top,null,lijn,null,null,textGroup,false);
		var circle2 = makeCircleAP(left+length,top,lijn,null,null,null,textGroup,true);
	


    const analyseGroup = [lijn, textGroup, circle1, circle2];
        analyseGroups.push(analyseGroup);
        analyseGroup.forEach(function(obj) {
          canvas.add(obj);
        });
     

		
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
        text.visible=true;
		

		var rect = new fabric.Rect({width: 100, height: 20, left: lijn.get('x2')+30, top: lijn.get('y2'), fill: 'red'});
		var textGroup = new fabric.Group([text], {selectable: false, left: lijn.get('x2')+45, top: lijn.get('y2')});
		var circle1 = makeCircleLAT(left,top,null,lijn,null,null,textGroup,false);
		var circle2 = makeCircleLAT(left,top+length,lijn,null,null,null,textGroup,true);

    const analyseGroup = [lijn, textGroup, circle1, circle2];
        analyseGroups.push(analyseGroup);
        analyseGroup.forEach(function(obj) {
          canvas.add(obj);
        });

		
     }

     function makeLatAnalyse(left,top,length) {
		
		
        var lijn1 = makeLine([ left, top, left, top+length ],analyseToolColor,2,false);
        var lijn2 = makeLine([ left, top+length, left, top+(length*2) ],analyseToolColor,2,false);
        var lijn3 = makeLine([ left, top+(length*2), left, top+(length*3) ],analyseToolColor,2,false);
        var lijn4 = makeLine([ left, top+(length*3), left, top+(length*4) ],analyseToolColor,2,false);
		
		 var text = new fabric.Text((0).toString(),
								{selectable: false,
								 left: lijn1.get('x2')+30, 
								 top: lijn1.get('y2'),
								 fontSize: 20,
								 backgroundColor : 'green',
								 fill: 'white',
                                 
								 });
        text.visible=true;
		

		var rect = new fabric.Rect({width: 100, height: 20, left: lijn1.get('x2')+30, top: lijn1.get('y2'), fill: 'red'});
		var textGroup = new fabric.Group([text], {selectable: false, left: lijn1.get('x2')+45, top: lijn1.get('y2')});
		var circle1 = makeCircleLAT(left,top,null,lijn1,null,null,textGroup,false);
    var circle2 = makeCircleLAT(left,top+length,lijn1,lijn2,null,null,textGroup,true);
    var circle3 = makeCircleLAT(left,top+(length*2),lijn2,lijn3,null,null,textGroup,true);
    var circle4 = makeCircleLAT(left,top+(length*3),lijn3,lijn4,null,null,textGroup,true);
    var circle5 = makeCircleLAT(left,top+(length*4),lijn4,null,null,null,textGroup,true);
		
    const analyseGroup = [lijn1,lijn2,lijn3,lijn4,textGroup, circle1, circle2,circle3,circle4,circle5];
        analyseGroups.push(analyseGroup);
        analyseGroup.forEach(function(obj) {
          canvas.add(obj);
        });             
		
		
		
     }


    function makeSpineQuadratic(left,top){
        var line = new fabric.Path('M 0 0 Q 0, 1, 0, 0', { fill: '', stroke: analyseToolColor, objectCaching: false });
        log("left: " + left);
        log("top: " + top);
        line.path[0][1] = left;
        line.path[0][2] = top;

        line.path[1][1] = left+50;
        line.path[1][2] = top+100;

        line.path[1][3] = left;
        line.path[1][4] = top+200;

        line.selectable = false;
        //canvas.add(line);
 
        var p1 = makeCurvePoint(left+100, top+50, null, line, null) // the one that moves the curve
        p1.name = "p1";
        //canvas.add(p1);

        var p0 = makeCurveCircle(left, top, line, p1, null);
        p0.name = "p0";
        //canvas.add(p0);

        var p2 = makeCurveCircle(left, top+200, null, p1, line);
        p2.name = "p2";
        //canvas.add(p2);

        const analyseGroup = [line,p1, p0, p2];
        analyseGroups.push(analyseGroup);
        analyseGroup.forEach(function(obj) {
          canvas.add(obj);
        });
        

    }

    function makeCurveCircle(left, top, line1, line2, line3) {
        var c = new fabric.Circle({
          left: left,
          top: top,
          strokeWidth: 5,
          radius: 12,
          fill: analyseToolColor,
          stroke: analyseToolColor
        });
    
        c.hasBorders = c.hasControls = false;
    
        c.line1 = line1;
        c.line2 = line2;
        c.line3 = line3;
    
        return c;
      }
    
      function makeCurvePoint(left, top, line1, line2, line3) {
        var c = new fabric.Circle({
          left: left,
          top: top,
          strokeWidth: 12,
          radius: 14,
          fill: analyseToolColor,
          stroke: analyseToolColor
        });
    
        c.hasBorders = c.hasControls = false;
    
        c.line1 = line1;
        c.line2 = line2;
        c.line3 = line3;
    
        return c;
      }
     
     

	 
	function makePatientHeightBars() {
		
      topBar =  new fabric.Line([0,30,canvasWidth,30], {fill: 'blue',stroke: 'blue',strokeWidth: 3,selectable: true,hasControls : false});
         topBarC = new fabric.Circle({
            left: 20,
            top: 30,
            strokeWidth: 5,
            radius: 12,
            fill: 'rgba(0,0,0,0)',
            stroke: 'blue'
            });
            
            topBarC.hasControls = topBarC.hasBorders = false;
            
            topBarC.on('moving', function() {
                topBar.set({ 'y1': topBarC.top, 'y2': topBarC.top });
            });
                    
         
         
		 topBar.on('modified', function() {
			//topbarY = topbar.get('top'); //use top instead of get('y1'), x and y are coords of bounding box.. not of the actual line
			calcCPP();
			//log(topbar.get('top'));
			
		});
		 
		 bottomBar =  new fabric.Line([0,canvasHeight-30,canvasWidth,canvasHeight-30], {fill: 'blue',stroke: 'blue',strokeWidth: 3,selectable: true,hasControls : false});
         bottomBarC = new fabric.Circle({
            left: 20,
            top: canvasHeight-30,
            strokeWidth: 5,
            radius: 12,
            fill: 'rgba(0,0,0,0)',
            stroke: 'blue'
            });
            
            bottomBarC.hasControls = bottomBarC.hasBorders = false;
            
            bottomBarC.on('moving', function() {
                bottomBar.set({ 'y1': bottomBarC.top, 'y2': bottomBarC.top });
            });
                 
		 bottomBar.on('modified', function() {
			//bottombarY = bottombar.get('top');
			calcCPP();
			//log(bottombarY);
			
		});
        
        

        canvas.add(topBar);
        canvas.add(topBarC);
        canvas.add(bottomBar);
        canvas.add(bottomBarC);
        canvas.renderAll();

        

        heightBarsPresent = true;
        
	}


    function onObjectSelected(e) {
        var activeObject = e.target;
    
        if (activeObject.name == "p0" || activeObject.name == "p2") {
          activeObject.line2.animate('opacity', '1', {
            duration: 200,
            onChange: canvas.renderAll.bind(canvas),
          });
          activeObject.line2.selectable = true;
        }
      }
    
      function onBeforeSelectionCleared(e) {
        var activeObject = e.target;
        if (activeObject.name == "p0" || activeObject.name == "p2") {
          activeObject.line2.animate('opacity', '0', {
            duration: 200,
            onChange: canvas.renderAll.bind(canvas),
          });
          activeObject.line2.selectable = false;
        }
        else if (activeObject.name == "p1") {
          activeObject.animate('opacity', '0', {
            duration: 200,
            onChange: canvas.renderAll.bind(canvas),
          });
          activeObject.selectable = false;
        }
      }
    
      function onObjectMoving(e) {
        var obj = e.target;
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
        

        if (e.target.name == "p0" || e.target.name == "p2") {
          var p = e.target;
    
          if (p.line1) {
            p.line1.path[0][1] = p.left;
            p.line1.path[0][2] = p.top;
            p.line1.path
          }
          else if (p.line3) {
            p.line3.path[1][3] = p.left;
            p.line3.path[1][4] = p.top;
          }
        }
        else if (e.target.name == "p1") {
          var p = e.target;
    
          if (p.line2) {
            p.line2.path[1][1] = p.left;
            p.line2.path[1][2] = p.top;
          }
        }
        else if (e.target.name == "p0" || e.target.name == "p2") {
          var p = e.target;
    
          p.line1 && p.line1.set({ 'x2': p.left, 'y2': p.top });
          p.line2 && p.line2.set({ 'x1': p.left, 'y1': p.top });
          p.line3 && p.line3.set({ 'x1': p.left, 'y1': p.top });
          p.line4 && p.line4.set({ 'x1': p.left, 'y1': p.top });
        }
      }



    
    
    //END ANALYSE AP-PA//



    //start zooming code
    canvas.on('mouse:wheel', (options) => {
      const zoom = canvas.getZoom();
      const zoomRatio = 1.1;

      if (options.e.deltaY < 0) {
        // Zoom in
        canvas.zoomToPoint(options.pointer, zoom * zoomRatio);
      } else {
        // Zoom out
        if (zoom / zoomRatio >= 1) {
          canvas.zoomToPoint(options.pointer, zoom / zoomRatio);
        } else {
          canvas.setViewportTransform([1, 0, 0, 1, 0, 0]); // Reset canvas transformation
        }
      }

      // Prevent scrolling the page
      options.e.preventDefault();
      options.e.stopPropagation();
    });

    let touchStartDistance = 0;
    let touchStartZoom;

    canvas.on('touch:gesture', (options) => {
      const zoom = canvas.getZoom();
      const zoomRatio = 1.01;

      if (options.e.touches && options.e.touches.length === 2) {
        const distance = Math.sqrt(
          (options.e.touches[0].clientX - options.e.touches[1].clientX) ** 2 +
          (options.e.touches[0].clientY - options.e.touches[1].clientY) ** 2
        );

        if (!touchStartDistance) {
          touchStartDistance = distance;
          touchStartZoom = zoom;
        }

        const zoomDelta = (distance - touchStartDistance) * 0.01;
        const newZoom = touchStartZoom + zoomDelta;

        if (newZoom > zoom) {
          // Zoom in
          canvas.zoomToPoint(
            new fabric.Point(options.e.touches[0].clientX, options.e.touches[0].clientY),
            newZoom
          );
        } else {
          // Zoom out
          if (zoom / zoomRatio >= 1) {
            canvas.zoomToPoint(
              new fabric.Point(options.e.touches[0].clientX, options.e.touches[0].clientY),
              newZoom
            );
          } else {
            canvas.setViewportTransform([1, 0, 0, 1, 0, 0]); // Reset canvas transformation
          }
        }
      } else {
        touchStartDistance = 0;
        touchStartZoom = null;
      }
    });
   



    //end zooming code




    $(document).on('click','.img-thumbnail',function(e) {            
        if (!selectImageMode){
            renderBackgroundImage(this.src);
            $( "#canvas-box" ).toggle();
            $( "#thumbnails" ).toggle();
        } else {
            $(this).toggleClass('imageSelected');
            if($(this).hasClass('imageSelected')){
                selectedImages.push (e.target.id);
                log(selectedImages);
            } else {
                
                selectedImages = selectedImages.filter(function(item){
                    return item !== e.target.id;
                });
                log(selectedImages);
            }

            //check if delete button has to be activated
            if (selectedImages.length > 0) {$('.btnDeleteImages').prop('disabled',false)}else{$('.btnDeleteImages').prop('disabled',true)};
        }
    });


//button actions
    //top toolbar
    
    $('#btnAnalyse').click(function() {
       isDrawing=false;
       canvas.isDrawingMode = isDrawing;
       $('.btn-toggle').removeClass('active');
       $(this).addClass('active'); 
       $('.toolbar').hide();
       $('.toolbar.analyse').toggle();
       if(!heightBarsPresent){makePatientHeightBars();};
       if ($(this).hasClass('active')){bottomBar.visible=true;;topBar.visible=true;topBarC.visible=true;bottomBarC.visible=true;}
       else{bottomBar.visible=false;topBar.visible=false;topBarC.visible=false;bottomBarC.visible=false}

       
       

       canvas.renderAll();
       
    });

    $('#btnTools').click(function() {
      isDrawing=false;
      canvas.isDrawingMode = isDrawing;
      $('.btn-toggle').removeClass('active');
       $(this).addClass('active'); 
      $('.toolbar').hide();
      $('.toolbar.tools').toggle();
      
      
      
   });

    $('#btnHideEyes').click(function(){
        var rect = new fabric.Rect({
            left: (canvasWidth/2)-150,
            top: 300,
            fill: 'black',
            width: 300,
            height: 50
          });

          blackBoxes.push(rect);
              canvas.add(rect);

    });

     $('#btnDraw').click(function() {
      $('.btn-toggle').removeClass('active');
      $(this).addClass('active'); 
       $('.toolbar').hide(); 
       $('.toolbar.draw').toggle();
       //start drawing
       
       isDrawing = !isDrawing;
       canvas.isDrawingMode = isDrawing;
       if (isDrawing) {
        brush = new fabric.PencilBrush(canvas);
        brush.color = color;
        brush.width = thickness;
        canvas.freeDrawingBrush = brush;
      } else {
        canvas.freeDrawingBrush = null;
      }

    


       

        
    });

    $('#btnRotatePlus90').click(function() {
      const backgroundImage = canvas.backgroundImage;
      if (backgroundImage) {
        bgImageCurAngle += 90;
        backgroundImage.rotate(bgImageCurAngle);
        canvas.renderAll();
      }
        
       
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
		makeYMeasureBar((canvasWidth/2)-150,canvasHeight/2,400);
    });

    $('#btnAnalyseX').click(function() {
        makeLatAnalyse(canvasWidth/2,200,150);
    });

    $('#btnAnalyseSpine').click(function() {
        makeSpineQuadratic((canvasWidth/2),canvasHeight/2);
    });

    $('#btnUndoAnalyse').click(function() {
      const lastGroup = analyseGroups.pop();
      if (lastGroup) {
        lastGroup.forEach(function(obj) {
          canvas.remove(obj);
        });
        canvas.renderAll();
      }
  });

    //tools toolbar
    $('#btnUndoHideEyes').click(function() {
      if (blackBoxes.length > 0) {
        log (blackBoxes);
        const lastObject = blackBoxes.pop();
        canvas.remove(lastObject);
        canvas.renderAll();
      }
    });



    //draw toolbar
    $('#color-picker').on('change', function() {
      color = $(this).val();
      brush.color = color;
      log(color);
      
    });

    $('#thickness-slider').on('change', function() {
      thickness = parseInt($(this).val());
      brush.width = thickness;
    
    });
    $('#undo-draw').on('click', function() {
      if (objectsDrawn.length > 0) {
        const lastObject = objectsDrawn.pop();
        canvas.remove(lastObject);
        canvas.renderAll();
      }
    });

//end button actions
    $('#select-image').click(function() {
        $( "#canvas-box" ).toggle();
        $( "#thumbnails" ).toggle();
        
        //$('.toolbar.analyse').toggle();
        if ($("#btnAnalyse").hasClass('active')){$('#btnAnalyse').click();}
        heightBarsPresent = false;
        canvas.clear();
        //clearImage();
        //clearTempLayer();
    });
        
    $('.toggleImagesPortfolio').click(function() {
        $( "#images" ).toggle();
        $( "#portfolio" ).toggle();
    });


    $('.btnSelectImages').click(function() {
        if(!selectImageMode){ //start selecting images
            selectImageMode = true;
           $(this).html('cancel');
           $('.btnDeleteImages').show();

        } else { //cancel selecting
            cancelSelectingImages();

        }

    });

    function cancelSelectingImages(){
        selectImageMode = false;
        $('.btnSelectImages').html('select');
        $('.img-thumbnail').removeClass('imageSelected');
        selectedImages = [];
        $('.btnDeleteImages').prop('disabled',true)
        $('.btnDeleteImages').hide();
        log (selectedImages);

    }
    
    $('.btnDeleteImages').click(function() {
        $.ajax({
            url: "ajax.php",
            type: 'post',
            data: {
              com: 'pictureproof',
              task: 'deleteImages',
              images: JSON.stringify(selectedImages)
            },
            success: function(data) {
              getCameraPictures();
              cancelSelectingImages();
            }
           });
        



    });



    
    $('#btnSaveToPatientPortfolio').click(function(){ 
      let timestamp = moment().format('HH:mm');
      let msg_saving = new Noty({
        text: '<span class="text-center">Saving to portfolio...</span><span class="pull-right"><i class="fa fa-times-circle">&nbsp;</i></span>',
        //closeWith:'click',
        layout:'top',
        theme:'sunset',
        type:'success'
        // timeout: 1500 
        
        }).show();	;  				
      try {
        bottomBar.setVisible(false);topBar.setVisible(false);
      } catch (error) {
        //console.error(error);
        // expected output: ReferenceError: nonExistentFunction is not defined
        // Note - error messages will vary depending on browser
      }
      
       var dataURL = $('#c').get(0).toDataURL('image/jpeg');//have to get the canvas element from the jquery object
      
   

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
                    msg_saving.close();
                    let msg_success = new Noty({
                      text: '<span class="text-center">Image saved to portfolio!</span><span class="pull-right"><i class="fa fa-times-circle">&nbsp;</i></span>',
                      //closeWith:'click',
                      layout:'top',
                      theme:'sunset',
                      type:'success',
                      timeout: 1500 
                      
                      }).show();
                  //add timestamp next to save button to feedback when it was saved
                  $('.save-timestamp').html(' saved @ ' + timestamp);
			});
    });
    
    $('#btnPrint').click(function() {	

      if($('#btnAnalyse').hasClass('active')){$('#btnAnalyse').click();}
       var tempImage = new Image();
           tempImage.id = "tempImage";
           tempImage.height=800;
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
        canvas.clear();
       
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
    
    
    
    function clearTempLayer(){
        tempLayerCtx = $("#tempLayer")[0].getContext("2d");
        tempLayerCtx.clearRect(0, 0, tempLayerCtx.canvas.width, tempLayerCtx.canvas.height);
    }
    
     function getCameraPictures() {
       
        $.ajax({type: "post", url: "ajax.php", dataType: "json",
          data: { com: 'pictureproof',task: 'getCameraPictures', patientID : patientID}
            }).done(function( cameraPictures ) {
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
            }).done(function( portfolioPictures ) {
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






