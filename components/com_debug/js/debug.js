$(function() {
     //minify the main menu
	$('#main-menu-toggle').click();
    
	getErrors(function(){
		window.scrollTo(0, document.body.scrollHeight);
	});
	
	function getErrors(callback) {
         $.ajax({
  			type: "post",
		    url: "ajax.php",
  			data: { com: 'debug', 
  					task: 'getErrors'}
			}).success(function( response ) {
				//console.log(response);
                $('#errors').html(response);
				callback();	
			});        
    }



    window.setInterval(getErrors, 2000)
    
    
    
    $("#break").click (function(){
        $.ajax({
  			type: "post",
		    url: "ajax.php",
  			data: { com: 'debug', 
  					task: 'break'}
			}).success(function( response ) {
				//console.log(response);
                //$('#errors').html(response);
								
			});        
        
        
        
        });
    
    
});

