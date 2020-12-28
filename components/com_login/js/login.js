$(function() {

	$( "#btn_login" ).click(function() {
		var username = $('#username').val();
		var password = $('#password').val();
	
			
			
			$.ajax({
  			type: "post",
		    url: "ajax.php",
		    dataType: 'html',
  			data: { com: 'login', 
  					task: 'login', 
  					username: username,
  					password: password}
  					
			}).done(function( response ) {
				console.log(response);
				
				response = $(response).text();
				
				console.log(response);
				
				if (response == 'success')
				{
					console.log('ok');
					//window.location="index.php";
					console.log(response);
				} else {
					var n = noty({text: 'Wrong password/username!!',type: 'error',layout:'topCenter'});
					console.log(response);
					
				}
					
					
			
				
  				
			});
		
			
	 


	});
});


function login()
{
	
	console.log('lgoni');
	
}