var tmpl_patient_search_results;
var tmpl_patient_demographics;
var tmpl_patient_appointments;
var tmpl_rooms_status;
var rightPanelPB = new NProgress({
  container:'#rightPanelProgress',
  randomTrickle:true

});


var getRoomInfo;





$(document).ready(function() {
  //hide the patient_details div
  $('#rightPanel .patient_details').toggle();
  $('#rightPanel .search_results').toggle();

  //init the progress bar



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
  tmpl_rooms_status = $('#tmpl_rooms_status').html();

  Mustache.parse(tmpl_patient_search_results);
  Mustache.parse(tmpl_patient_demographics);
  Mustache.parse(tmpl_patient_appointments);
  Mustache.parse(tmpl_rooms_status);

  // get the room statuses
  getRoomStatuses = function(){
    Clinic.getRoomsStatusClinic(clinicPresent,function(data){
      // Custom function to preprocess data for Mustache
          
      data = preprocessData(data);

          // Render the template with processed data
              var rendered = Mustache.render(tmpl_rooms_status, { data: data });
          $('#rooms_status').html(rendered);
          //alert(rendered);
      });
          
      function preprocessData(data) {
          var processedData = [];
          var currentPractitionerId = null;
          var isNewPractitioner = null;
          
          data.forEach(function (item) {
            //get time from timestamp
            //log(item);
            if (item.busy == 0){item.busy = false};
            if (item.busy == 1){item.busy = true};   
            switch (item.status) {
              case '3':
                item.borderColor = "#FC8906";
              break;
              case '4':
                item.borderColor = "#ff5454";
              break;

              case '5':
                item.borderColor = "#F406FC";
      
              default:
                //do nothing
            }

            var time = moment(item.timestamp).locale(locale).format('LT');
              if(item.practitioner_id !== item.resourceId){// get this value out
                item.check = false;
              } else {
                item.check = true;
              }

              if (item.practitioner_id !== currentPractitionerId) {
                isNewPractitioner = true;
                  currentPractitionerId = item.practitioner_id;
              } else {
                isNewPractitioner = false;
              }
              
              var newData = {
                  isNewPractitioner: isNewPractitioner,
                  time : time,
                  ...item  // Include all properties from the item
                  
                };
              processedData.push(newData);

              
              //log ('here comes the new data');
              //log(processedData);
              });
          return processedData;

        }
  }

  getRoomStatuses();
  


      


 //search bar stuff

    var results

    var ajaxReq = 'ToCancelPrevReq'; // you can have it's value anything you like
    let timeout = null;
    

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

      clearTimeout(timeout);
      timeout = setTimeout(function () {
        let q = $('#rightPanel .patient-search').val();
        if ($('#rightPanel .patient-search').val().length > 2){

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
             rightPanelPB.start(); 
          },
          success: function(patients) {
            if(patients.length == 0) {
              $('#rightPanel .search_results').html("<strong>No matches for this search</strong><br>Sorry we haven't been able to find any patients matching this search.<br><br><br><br><br><br><br><br><br>");
              rightPanelPB.done();
              return
            }
            
            rightPanelPB.done();
                  
              var rendered = Mustache.render(tmpl_patient_search_results,
                {patients : patients
               });
  		     
              $('#rightPanel .search_results').html(rendered);
  
          
              var pattern=new RegExp("("+q+")", "gi");
              var new_text= $('#rightPanel .search_results').html().replace(pattern, "<b>"+q+"</b>");
              
              $('#rightPanel .search_results').html(new_text);
          
      },
      error: function(xhr, ajaxOptions, thrownError) {
        if(thrownError == 'abort' || thrownError == 'undefined') return;
        alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
      }
  
        });
      }  // end if
      }, 1000); // end timeout


     
       
        
       

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
      loadPatientDetailsRightPanel(patientID);



    });


    $(document).on('click','#rightPanel .patient_details .back',function() {
      $('#rightPanel .patient_details').toggle();
      $('#rightPanel .search_results').toggle();
    });

    $(document).on('click','#rightPanel .editPatient',function() {
      editPatient(patientID);
    });

	$(document).on('click','#rightPanel .sendEmail',function() {
              $('#sendEmailForm')[0].reset();
              $validatorSendEmail.resetForm();
              $('#emailModal .to').val(oPatient.email);
              $('#emailModal .modal-title').html('Send message to ' + oPatient.patient_firstname + ' ' + oPatient.patient_surname);
              $('#emailModal').modal('show');
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
       let start = $(this).attr('start');
       let resourceId = $(this).attr('resourceId');
       eventIDtoHighlight = $(this).attr('appointmentID');
       highlightEvent = true;

       if (selectedUser == resourceId) { //no need to switch user.. just calendar.. 
        calendar.fullCalendar( 'gotoDate', moment(start,'YYYY-MM-DD')); 
        calendar.fullCalendar( 'rerenderEvents' );
      
       } else { // we need to switch user.. 
        //$('#userSelect option[value=' + resourceId + ']').attr('selected', 'selected');
        $('#userSelect').val(resourceId);
        calendar.fullCalendar( 'gotoDate', moment(start,'YYYY-MM-DD')); 
        $("#userSelect").trigger("change");
       }

       
      
     });

     

});

function loadPatientDetailsRightPanel(patientID){
  if($("#rightPanel").is(":visible")){

  }else{
    $('.fc-toggleSidebarRight-button').click();
  }
  $('#rightPanel .default').hide();
  rightPanelPB.start();
  Patient.get(patientID,function(patient){
    oPatient = patient; //set the Global var
    renderRightPanelPatientDetails(oPatient);
    rightPanelPB.done();
    
    
  });
  renderRightPanelPatientAppointments();

}

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

    //get the practitioner name
   //log(users);
   //var oUser = users.find(x => x.data.ID === oPatient.practitioner.toString());

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
           insurance:oPatient.insurance,
           practitioner:users[oPatient.practitioner].data.display_name
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








