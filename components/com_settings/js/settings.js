$(function() {
    $('#editor').wysiwyg();
    
    $( ".insert_text" ).click(function() {
		console.log('clicked');
		var text = 'this is the text';//$(this).attr( 'text' ); // get the text
		insertAtCursor('editor',text);				
		

	});
    
    $( "#btn_save_template" ).click(function() {
    	var template = $("#editor").html();
    	var template_id = $("#template_id").val();
    	var template_name = $("#template_name").val();
    	
  		$.ajax({
  			type: "post",
		    url: "ajax.php",
  			data: { com:'settings',
  					task:'save_template',
  					template_id: template_id, 
  					template_name: template_name, 
  					template: template }
			}).done(function( msg ) {
  				var n = noty({text: 'Template saved...',type: 'success',layout:'topCenter'});
			});
  
	});
	
	
	$( ".delete_template" ).click(function() {
		var template_id = $(this).attr( 'template_id' ); // get the template id // need to do this here and not in the if statement below - template will be undifined
	
		bootbox.confirm("Are you sure you want to delete this template?", function(result) {
		if (result == true) // delete the template from db
		{
			console.log('confirmed...');
			
			
			$.ajax({
  			type: "post",
		    url: "ajax.php",
  			data: { com: 'settings', 
  					task: 'delete_template', 
  					template_id: template_id}
			}).done(function( response ) {
				console.log(response);
					
					var n = noty({text: 'Template deleted...',type: 'success',layout:'topCenter'});
					$('#'+template_id).remove();
				
			
				
  				
			});
		}
			
		}); 


	});
	
	$( "#btn_new_template" ).click(function() {
		
		bootbox.prompt("What will be the name of the new template?", function(template_name) {                
  			if (template_name === null) {                                             
    			//Example.show("Prompt dismissed");                              
  			} else {
    			//Example.show("Hi <b>"+result+"</b>");   
    			console.log(result)
    			$.ajax({
  					type: "post",
		    		url: "ajax.php",
  					data: { com: 'settings', 
  							task: 'add_new_template', 
  							template_name: template_name}
				}).done(function( response ) {
					console.log(response);
					
					var n = noty({text: 'New Template Added..',type: 'success',layout:'topCenter'});
					
				});//ajax
    			
    			
    		}//if
		});//bootbox


	});//btn_new_template
	

});


function insertText(text) {
	//alert('clicked');	
	//var text = $(this).attr( 'value' );
    insertAtCursor('editor',text);
    
}
    


