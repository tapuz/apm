function sendPatientToSalesbinder()
{
 //console.log($('patient_phone').val());
	
	var customer = {Customer:
    {
        context_id:"2",
        name: $('#patient_name').val(),
       	office_email:$('#patient_email').val(),
       	billing_address_1:$('#patient_address').val(),
       	billing_city:$('#patient_city').val(),
       	billing_postal_code:$('#patient_postcode').val(),
       	billing_country:$('#patient_country').val(),
       	office_phone:$('#patient_phone').val()
    }
    
                };

    var customer_json = JSON.stringify(customer);

	console.log(customer_json);
	


	$.ajax({
					url: 'http://e1c54b702b33b35d3dcbba6c46ee95596fb8306a:x@dhealthcare.salesbinder.com/api/customers.json',
            		type: 'POST',
            		contentType: 'application/json',
            		crossDomain : true,
            		data: customer_json, 
            		dataType: 'json',
            		xhrFields: {
       withCredentials: true
    },
					})
					.then( function ( response ) {
						//$.each( response, function ( i, val ) {
						//	html += "<li>" + val + "</li>";
						// });
						console.log(response);
						var n = noty({text: 'Account created...',type: 'success',layout:'topCenter'});
						alert(response.Customer.id); 
						
						//$ul.listview( "refresh" );
						//$ul.trigger( "updatelayout");
					});
	
}