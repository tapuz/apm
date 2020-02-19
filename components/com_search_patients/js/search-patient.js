	$(document).ready(function() {
		$('tr')
                .mouseover(function(){
                    $(this).addClass('active');
                })
                .mouseout(function(){
                    $(this).removeClass('active');
                })
                .superLink();
        $('#search-patient').focus();
		$('#search-patient').keyup(function() {
				var search_val = $('#search-patient').val();
				var results_div = $('#results');
				if ( search_val.length > 2 ) {
				
					
					$.ajax({
						url: "components/com_search_patients/models/patients.php",
						dataType: "html",
						crossDomain: true,
						data: {
							q: search_val,
							method :"searchPatient"
						}
					})
					.then( function ( response ) {
						//$.each( response, function ( i, val ) {
						//	html += "<li>" + val + "</li>";
						// });
						console.log(response);
						
						$('#results').html(response);
						$('#results').trigger('updatelayout');
						
						//$ul.listview( "refresh" );
						//$ul.trigger( "updatelayout");
					});
				}
			});
		});



function loadPatientDetails(patient_id)
{
	$.mobile.changePage("#patient-details", "", true, false);	
	
	$.ajax({
						url: config.root_com + "com_patients/models/patients.php",
						dataType: "html",
						crossDomain: true,
						data: {
							patient_id : patient_id,
							method :"getPatientDetails"
						}
					})
					.then( function ( response ) {
						//$.each( response, function ( i, val ) {
						//	html += "<li>" + val + "</li>";
						// });
						$('#patient-details-div').html( response );
						$('#patient-details-div').trigger('create');
						
					});
	
}




