$(function() {
    var canvasWidth = '1100';
    var canvasHeight = '800';
    //minify the main menu
	$('#main-menu-toggle').click ();
    //lets create 2 canvasses: 1 for the image and 1 for the drawing
    var newLayer1 = $('<canvas/>',{
                    id: 'imgLayer'                   
                }).prop({
                    width: canvasWidth,
                    height: canvasHeight});
    var newLayer2 = $('<canvas/>',{
                    id: 'drawingLayer'                   
                }).prop({
                    width: canvasWidth,
                    height: canvasHeight
                });
    //a temp layer for merging other layers into for printing and saving...
    var tempLayer = $('<canvas/>',{
                    id: 'tempLayer'                   
                }).prop({
                    width: canvasWidth,
                    height: canvasHeight
                });
    //append them to the board
    $('#board').append(tempLayer);
    $('#board').append(newLayer1);
    $('#board').append(newLayer2);
    
    //set the positions
    $("#board").css({position: 'relative'});
    $("#tempLayer").css({top: 0, left: 0, position:'absolute'});
    $("#imgLayer").css({top: 0, left: 0, position:'absolute'});
    $("#drawingLayer").css({top: 0, left: 0, position:'absolute'});
    

    var position = $('#imgLayer').position();
    
    console.log(position.top);
    console.log(position.left);
    
    
    //hide the canvas
    $( "#canvas-box" ).toggle();
    
    var clickX = new Array();
    var clickY = new Array();
    var clickDrag = new Array();
    var paint;
    var whiteBoard = $("#drawingLayer");
   // var newImage = new Image();
   //    newImage.src = "http://tlccrx.com/wp-content/uploads/2013/11/Dermatome.jpg";
    
    $('.img-thumbnail').click(function() {
        context = document.getElementById("imgLayer").getContext("2d");
        //context.drawImage(this, 0,0,canvasHeight,this.width * (canvasHeight/this.height));
        context.drawImage(this, 0,0,canvasWidth,this.height * (canvasWidth/this.width));
        //ctx.drawImage(img, 300, 0, 300, img.height * (300/img.width));
        console.log('loading the image');
        $( "#canvas-box" ).toggle();
        $( "#thumbnail-box" ).toggle();
    
    });

    $('#select-image').click(function() {
        $( "#canvas-box" ).toggle();
        $( "#thumbnail-box" ).toggle();
        clearDrawing();
        clearImage();
        clearTempLayer();
        
    });
    
    $('#saveToPatientPortfolio').click(function(){
        //merge the layers
       var printLayer = $('#tempLayer')[0];
       var printLayerCtx=printLayer.getContext('2d');
        
       var img = $('#imgLayer')[0];
       var drawing = $('#drawingLayer')[0];
       //set printlayer BG to white
       printLayerCtx.fillStyle = "white";
       printLayerCtx.fillRect(0,0,1100,800);
       
       printLayerCtx.drawImage(img,0,0);
       printLayerCtx.drawImage(drawing,0,0);
       
       var dataURL = $('#tempLayer').get(0).toDataURL("image/png"); //have to get the canvas element from the jquery object
        
        $.ajax({
  			type: "post",
		    url: "ajax.php",
  			data: { com: 'educate', 
  					task: 'saveToPatientPortfolio', 
  					imgBase64: dataURL}
			}).success(function( response ) {
				console.log(response);
				
					var n = noty({text: 'Saved to Patient Portfolio',type: 'success',layout:'topCenter'});  				
			});
        });
    
    $('#print').click(function() {
    	//var clinic_logo = $("#clinic_logo").val();
    	//var header = $("#clinic_letter_heading").val() + "<br><br>";
       //var header = $("#clinic").val() + "<br><br>";
       
       //merge imgLayer and drawingLayer to printLayer so we can print it.
       
       var printLayer = $('#tempLayer')[0];
       var printLayerCtx=printLayer.getContext('2d');
        
       var img = $('#imgLayer')[0];
       var drawing = $('#drawingLayer')[0];
       printLayerCtx.drawImage(img,0,0);
       printLayerCtx.drawImage(drawing,0,0);
       //create an Image element because printThis will not print the Canvas element
       var tempImage = new Image();
           tempImage.id = "tempImage";
           //tempImage.height=800;
           //tempImage.width =1100;
           tempImage.src = printLayer.toDataURL();
        $('#board').append(tempImage);
        //print
        var header = $('#clinicHeader').val() + "<H3>Patient: " +patientName+"("+patientDOB+")</H3>";

    	$('#tempImage').printThis({header: header});
        //delete the tempImage
        tempImage.remove();
        clearTempLayer();
	
    });
    
    $('#clear_drawing').click(function(){
        clearDrawing();
        });
    
    function clearImage(){
         // Clears the image
        imgLayerCtx = $("#imgLayer")[0].getContext("2d");
        imgLayerCtx.clearRect(0, 0, imgLayerCtx.canvas.width, imgLayerCtx.canvas.height);
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
    
    function getMousePos(canvas, evt) {
       var rect = document.getElementById("drawingLayer").getBoundingClientRect();
       
       return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
    }
    function addClick(x, y, dragging)
    {
      clickX.push(x);
      clickY.push(y);
      clickDrag.push(dragging);
    }
    
    function redraw(){
        context = document.getElementById("drawingLayer").getContext("2d");
        //context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
  
        context.strokeStyle = "#df4b26";
        context.lineJoin = "round";
        context.lineWidth = 5;
			
    for(var i=0; i < clickX.length; i++) {		
        context.beginPath();
    if(clickDrag[i] && i){
      context.moveTo(clickX[i-1], clickY[i-1]);
     }else{
       context.moveTo(clickX[i]-1, clickY[i]);
     }
     context.lineTo(clickX[i], clickY[i]);
     context.closePath();
     context.stroke();
    }
    } 
    
   $('#drawingLayer').mousedown(function(e){
        var pos = getMousePos(whiteBoard,e);
        var mouseX = pos.x;
        var mouseY = pos.y;
		
        paint = true;
        addClick(mouseX, mouseY);
        redraw();
        console.log("mousedown");
        
    });
   
   $('#drawingLayer').mousemove(function(e){
        if(paint){
            var pos = getMousePos(whiteBoard,e);
            var mouseX = pos.x;
            var mouseY = pos.y;
            addClick(mouseX, mouseY, true);
            redraw();
        }
    });
   
   $('#drawingLayer').mouseup(function(e){
        paint = false;
 
    });
    
    $('#drawingLayer').mouseleave(function(e){
        paint = false;
    });
    
    
    
    
});


function pdf(){
        $.ajax({
  			type: "post",
		    url: "ajax.php",
  			data: { com: 'educate', 
  					task: 'pdf'}
			}).success(function( response ) {
				//console.log(response);
				
					var n = noty({text: 'pdf created',type: 'success',layout:'topCenter'});  				
			});
    }
    

function thierry() {
    alert('hello');
}






