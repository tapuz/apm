
function editPatient(patientID){
    $('#editPatient').modal('show');
    Patient.get(patientID,function(patient){
            
            patientID = patient.patient_id;
           // moment.locale('en');moment.locale('en');
            //moment("20111031", "YYYYMMDD")
            $('#Patient_FirstName').val(patient.patient_firstname);
            $('#Patient_LastName').val(patient.patient_surname);
            $('#Patient_DOB').val(moment(patient.dob,'YYYY-MM-DD').format('L'));
            $('#Patient_Sex').val(patient.sex);
            $('#Patient_Phone').val(patient.phone);
            $('#Patient_Email').val(patient.email);
            $('#Patient_Profession').val(patient.profession);
            $('#Patient_Insurance').val(patient.insurance);
            $('#clinicSelectEditPatient').val(patient.clinic);
           
            $('#Patient_Address').val(patient.address);
            $('#Patient_Postcode').val(patient.postcode);
            $('#Patient_City').val(patient.city);
            
            $('#editPatientForm .patientDetails').show();
            $('#editPatientForm .loading').hide();
            
            
        });



    }

$(document).ready(function() {
    

    
    $('#editPatient').on('hidden.bs.modal', function () {
        $('#editPatientForm .patientDetails').hide();
        $('#editPatientForm .loading').show();
    });
    

  
    
    $('#editPatientForm').on('submit', function(e) {
        e.preventDefault();
        form = ($(this).serializeArray());
        log('form--> ' + form);
        //save the data to the server
        log(form[2].value);
        
        //format date for DB
        var dob = form[2].value = moment(form[2].value, 'DD-MM-YYYY').format();
        Patient.update(patientID,form,function(patient){
            oPatient = JSON.parse(patient);
            log('this is the udpated patient + ' + oPatient.patient_surname);
            var filter = patientID;
            var events = $('#calendar').fullCalendar('clientEvents', function(evt) {
              return evt.patientID == filter;

            
            });
            
            log(events);
            
            $.each(events, function() {
            log(this.id + ' is the ID');
                this.title =  $('#Patient_LastName').val() + ' ' +  $('#Patient_FirstName').val();
                this.patientName = this.title;
                this.email = $('#Patient_Email').val();
                this.phone = $('#Patient_Phone').val();
                this.dob = dob;
                this.insurance = $('#Patient_Insurance').val();
            });
            calendar.fullCalendar( 'updateEvents', events );
            

            //update the patient details in the right panel
            renderRightPanelPatientDetails();
            
            $('#editPatient').modal('hide');
            
        
          
            
            
            
        });
        
        
        
        
    });
    


});

