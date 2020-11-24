	$(document).ready(function() {

		tmpl_patient_search_results  = $('#tmpl_patient_search_results').html();
		Mustache.parse(tmpl_patient_search_results);

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
				var q = $('#search-patient').val();
				var results_div = $('#results');
				console.log('hello');
				ajaxReq = $.ajax({
					url: "ajax.php",
					dataType: "json",
					type: 'get',
					data: {
					  com: 'calendar',
					  task: 'searchPatients',
					  name: q
			
					},
					beforeSend : function() {
					   //rightPanelPB.start(); 
					},
					success: function(patients) {
					  if(patients.length == 0) {
						$('#results').html("<strong>No matches for this search</strong><br>Sorry we haven't been able to find any patients matching this search.<br><br><br><br><br><br><br><br><br>");
						//rightPanelPB.done();
						return
					  }
					  
					  //rightPanelPB.done();
					  
					 
							  
						var rendered = Mustache.render(tmpl_patient_search_results,
						  {patients : patients
						 });
			
						$('#results').html(rendered);
			
					
						var pattern=new RegExp("("+q+")", "gi");
						var new_text= $('#rightPanel .search_results').html().replace(pattern, "<b>"+q+"</b>");
						
						$('#results').html(new_text);
					
				},
				error: function(xhr, ajaxOptions, thrownError) {
				  if(thrownError == 'abort' || thrownError == 'undefined') return;
				  alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
				}
			
				  });
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




