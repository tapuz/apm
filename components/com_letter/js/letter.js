$(function() {
    $('#editor').wysiwyg();
    
    $( "#save_new_letter" ).click(function() {
		var letter = $("#editor").html();
		var patient_id = $("#patient_id").val();
		var user_id = $("#user_id").val();
		var name = $("#name").val();
		var note = $("#note").val();
		
		console.log('clicked');
		
  		$.ajax({
  			type: "post",
		    url: "index.php?com=letter&page=ajax&task=save_new_letter",
  			data: { letter: letter, patient_id: patient_id, user_id: user_id, name:name, note:note }
			}).done(function( response ) {
  			
			});
  
	});
	

    
	$( ".delete_letter" ).click(function() {
		var letter_id = $(this).attr( 'letter_id' ); // get the letter id
							
		bootbox.confirm("Are you sure?", function(result) {
		if (result === true) // delete the letter from db
		{
			console.log('confirmed...');
										
			$.ajax({
  			type: "post",
		    url: "ajax.php",
  			data: { com: 'letter', 
  					task: 'delete_letter', 
  					letter_id: letter_id}
			}).success(function( response ) {
				console.log(response);
				
					var n = noty({text: 'Letter Deleted',type: 'success',layout:'topCenter'});
					$('#'+letter_id).remove();
				
			
				
  				
			});
		}
			
		}); 


	});
    
    $(".load_template").click(function() {
        var template_id = $(this).attr('template_id'); 
        var patient_id = $("#patient_id").val();
        var clinic_id = $("#clinic option:selected").attr('clinic_id');
        bootbox.confirm("Load new template?", function(result) {
        if (result) {
            //load the template
            $.ajax({
  			type: "post",
		    url: "ajax.php",
  			data: { com: 'letter', 
  					task: 'load_template', 
  					id:template_id,
                    patient_id:patient_id,
                    clinic_id:clinic_id}
			}).success(function( response ) {
				
                	$('#editor').html(response);
			
				
  				
			});
            
        }
        
       
        }); 
    });
    

});

function deleteLetter()
{
	var value = $(this).attr( 'href' );
}

function saveLetter()
{
        
		var letter_id = $('#letter_id').val();
		var letter = $("#editor").html();
    	var name = $("#name").val();
    	var note = $("#note").val();
        var clinic_id = $("#clinic option:selected").attr('clinic_id');
       
    	
    	//console.log('clicked');
    	
  		$.ajax({
  			type: "post",
		    url: "ajax.php",
  			data: { com:'letter',task:'save_letter',letter_id: letter_id, letter: letter, name:name, note:note, clinic_id:clinic_id }
			}).success(function( response ) {
				var n = noty({text: 'letter saved...',type: 'success',layout:'topCenter'});
  				
			});
}




function printLetter() {
	//get the clinic header
	var clinicID = $('#clinic').val();
	$.ajax({
		type: "post",
	  	url: "ajax.php",
		data: { com:'letter',task:'getClinic',clinic_id: clinicID }
	  }).success(function( data ) {
		  data = JSON.parse(data);
    	  var header = data.clinic_letter_heading + "<br><br>";
		  $('#editor').printThis({header: header});
	
		  	
	  });

	
}



function loadTemplate(id){
		
		var patient_id = $("#patient_id").val();
		//$("#editor").load("index.php?com=letter&page=ajax&task=load_template #template", {id:id,patient_id:patient_id});
		
		var success = confirm('You will lose any changes made to the letter. Continue?');
    		if(success)
		 {
        	link = "index.php?com=letter&page=ajax&task=load_template&id=" + id + "&patient_id=" + patient_id + " #template";
			$("#editor").load(link);
    	 }  
        
		
		
		
}





    

