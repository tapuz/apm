function login()
{
	
	username= $('#username').val();
	password= $('#password').val();
	
	
	
	   request = $.ajax({
		  url: config.root + "models/model-login.php", 
		  data: {username : username , password : password},
		  dataType: "html"
		});
		
		
		request.done(function(response) {
			if (response == "success")
			{
				$.mobile.changePage("#search-patient", "", true, false);
			} else {
				alert (response);
			}
			
		});

		request.fail(function(jqXHR, textStatus) {
		    alert( "Request failed: " + textStatus );
		});
	
	
}
