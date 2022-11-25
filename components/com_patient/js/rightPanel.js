
$(document).ready(function(){

    $(document).on('click','#feed .sendEmail',function() {
        $('#sendEmailForm')[0].reset();
        $validatorSendEmail.resetForm();
        $('#emailModal .to').val(oPatient.email);
        $('#emailModal .modal-title').html('Send message to ' + oPatient.patient_firstname + ' ' + oPatient.patient_surname);
        $('#emailModal').modal('show');
    });
log (oPatient);

});


