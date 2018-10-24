var tmpl_patient_search_results;
var tmpl_patient_demographics;
var tmpl_patient_appointments

$(document).ready(function() {
  //hide the patient_details div
  $('#rightPanel .patient_details').toggle();
  $('#rightPanel .search_results').toggle();

  //load the datepicker
  datepicker = $('#datePicker').datepicker({
    calendarWeeks: true,
    todayHighlight: true,
    
  }).on('changeDate', function(e) {
    calendar.fullCalendar( 'gotoDate', e.date); 
  });



  //load the templates & parse
  tmpl_patient_search_results  = $('#tmpl_patient_search_results').html();
  tmpl_patient_demographics = $('#tmpl_patient_demographics').html();
  tmpl_patient_appointments = $('#tmpl_patient_appointments').html();

  Mustache.parse(tmpl_patient_search_results);
  Mustache.parse(tmpl_patient_demographics);
  Mustache.parse(tmpl_patient_appointments);
  
    var results

    $('#rightPanel .patient-search').keyup(function() {
      $('#rightPanel .patient_details').hide();
      $('#rightPanel .default').hide();
      $('#rightPanel .search_results').show();

      if ($(this).val().length < 1){
        $('#rightPanel .search_results').html('')
        $('#rightPanel .search_results').hide();
        $('#rightPanel .default').show();
        return;
      } //input string is empty
        
        
        $.ajax({
        url: "ajax.php",
        dataType: "json",
        type: 'post',
        data: {
          com: 'calendar',
          task: 'searchPatients',
          name: ($(this).val())

        },
        success: function(patients) {
  
				$('#rightPanel .search_results').html(results);
                  
        var rendered = Mustache.render(tmpl_patient_search_results,
          {patients : patients
          });

        $('#rightPanel .search_results').html(rendered);
		}

      });

    });
    $('.clear_right_panel_search').click(function(){
      $('#rightPanel .patient-search').val('');
      $('#rightPanel .search_results').html('')
      $('#rightPanel .search_results').hide();
      $('#rightPanel .patient_details').hide();
      $('#rightPanel .default').show();
    });

    $(document).on('click','#rightPanel .patient',function() {
      //get the patient details,push them into template
      patientID = $(this).attr('patient_id'); //set Global var

      Patient.get(patientID,function(patient){
        oPatient = patient; //set the Global var
        log('this is the pat: ' + oPatient );
        renderRightPanelPatientDetails(oPatient);
        
      });
      renderRightPanelPatientAppointments();



    });

    $(document).on('click','#rightPanel .patient_details .back',function() {
      $('#rightPanel .patient_details').toggle();
      $('#rightPanel .search_results').toggle();
    });

    $(document).on('click','#rightPanel .editPatient',function() {
      editPatient(patientID);
    });

     $(document).on('click','#rightPanel .bookAppointment',function() {
      
      bFlagBookNext = true;
      fNewPatient = false;
      patientID = oPatient.patient_id;
      objNewAppointment = oPatient;
      objNewAppointment.patientName = oPatient.patient_surname + ' ' + oPatient.patient_firstname;
      fcMessage = new Noty({
        text: '<span class="text-center">Choose a time for the appointment</span><span class="pull-right"><i class="fa fa-times-circle">&nbsp;</i></span>',
        //closeWith:'click',
        layout:'top',
        theme:'sunset',
        type:'information',
        callbacks: {afterClose: function() {bFlagBookNext = false;}}
        }).show();
    });
  
     $(document).on('click','#rightPanel .right_panel_appointment',function() {
       
       var start = $(this).attr('start');
       eventIDtoHighlight = $(this).attr('appointmentID');
       highlightEvent = true;
       calendar.fullCalendar( 'gotoDate', moment(start,'YYYY-MM-DD')); 
       calendar.fullCalendar( 'rerenderEvents' );
      
     });

     

});


function renderRightPanelPatientDetails(){
   // check the sex of the patient and set the correct icon
   var sexIcon;
   switch (oPatient.sex){
    case 'male':
        sexIcon = '<i class="fas fa-mars"></i>';
        break;
    case 'female':
        sexIcon = '<i class="fas fa-venus"></i>';
        break;
    default:
        sexIcon = '<i class="far fa-question-square"></i>';
        
    }
   var rendered = Mustache.render(tmpl_patient_demographics,
          {patient_id : oPatient.patient_id,
           patient_name : oPatient.patient_surname + ' ' + oPatient.patient_firstname,
           sex:sexIcon,
           dob: moment(oPatient.dob,'YYYY-MM-DD').format('L'),
           age: moment().diff(oPatient.dob, 'years',false), //false gives a non fraction value
           phone : oPatient.phone,
           email: oPatient.email,
           street:oPatient.address,
           city:oPatient.postcode + ' ' + oPatient.city,
           country:oPatient.country,
           insurance:oPatient.insurance 
          });

  $('#rightPanel .patient_details').show();
  $('#rightPanel .search_results').hide();
  $('#rightPanel .patient_demographics').html(rendered);

}

function renderRightPanelPatientAppointments(){
  var futureAppointments, lastAppointment
  $.when(
    Appointment.getFutureAppointments(patientID,function(appointments){futureAppointments = appointments}),
    Appointment.getLastAppointment(patientID,function(appointment){lastAppointment = appointment})

  
  ).then(function() {
    var title_future_appointments = 'Next Appointment';
    var title_last_appointment = 'Last Appointment';
    if (futureAppointments.length > 1){title_future_appointments = 'Next Appointments'};
    if (futureAppointments.length < 1){title_future_appointments = 'No future appointments'};
    if (lastAppointment.length <1 ){title_last_appointment = "No last appointment"}

      var rendered = Mustache.render(tmpl_patient_appointments,
          { title_future_appointments:title_future_appointments,
            title_last_appointment: title_last_appointment,
            future_appointments : futureAppointments,
            last_appointment : lastAppointment
          });
      $('#rightPanel .patient_appointments').html(rendered);  
  
  });
  

}







