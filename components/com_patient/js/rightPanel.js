
$(document).ready(function(){

    $(document).on('click','#feed .sendEmail',function() {
        $('#sendEmailForm')[0].reset();
        $validatorSendEmail.resetForm();
        $('#emailModal .to').val(oPatient.email);
        $('#emailModal .modal-title').html('Send message to ' + oPatient.patient_firstname + ' ' + oPatient.patient_surname);
        $('#emailModal').modal('show');
    });
	
	$(document).on('click','.deletePatient',function() {
        
    });
    
    $(document).on('click','.deletePatient',function(){ 
		showConfirm('Are you sure you want to delete this patient and all data associated with this patient?').then(function(result){
			if(result){
				showLoadingScreen();
				Patient.delete(patientID,async function(){
					showLoadingScreen();
					$('.loadingscreen').html("<BR>PATIENT DELETED...</div>");
				});

			}
			
		  }); 
	 });
});


