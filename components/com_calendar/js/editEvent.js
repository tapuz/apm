//var mode = 'newPatient';
var fNewPatient = true;
var appModalMode; //newAppointment or editAppointment
var customAppModalMode;//newCustomAppointment or editCustomAppointment
$(document).ready(function() {
  //init some stuff
var patientLinkedClinic = null;

  $('.selected').hide();

  //$('#btnSaveNewAppointment').prop('disabled', true);

  $('#editBusyTime').on('submit', function(e){
    e.preventDefault();
    var duration = $('#editBusyTime .duration option:selected').val();
    var start = moment(eventStart).format();
    var end = eventStart.clone().add(duration, 'minutes').format();
    var note= $('#busyTimeDesc').val();
    if (note==''){note='Busy'};
   
  
    
    Appointment.addCustom({start:start,end:end,userID:userID,note:note},function (appointment){
            eventIDtoHighlight = appointment.id;
            highlightEvent = true;
            calendar.fullCalendar('renderEvent', appointment);
            calendar.fullCalendar('unselect');
            closeEditAppModal();        
           
            });
  });

  $('#editAppointment').on('submit', function(e) {
    e.preventDefault();
    
    if ($('#clinicSelectEditApp').val() === null ) {//clinic has not been selected.. display message and break
      new Noty({
      text: 'Select a clinic',
      //closeWith:'click',
      layout:'top',
      theme:'sunset',
      type:'error',
      timeout:3500
      }).show();
      return;
    }
    switch (appModalMode) {
    case 'newAppointment':
       eventStatus = 0;
       var duration = $('#selectService :selected').attr('duration');
           var start = moment(eventStart).format();
           var end = eventStart.clone().add(duration, 'minutes').format();
           var service = $('#selectService').val();
           var clinic = $('#clinicSelectEditApp').val();
        if (fNewPatient === true) {
            var aFullName = $('#patient-search').val().trim().replace(/ +(?= )/g, '').split(" ");
            var sFirstname = aFullName.pop();
            var sSurname = aFullName.join(" ");
          Patient.add(
                      {
                        surname: sSurname,
                        firstname: sFirstname,
                        phone: $('#phone').val(),
                        email: $('#email').val(),
                        practitioner: userID,
                        clinic: clinic
                      },function(newPatientID){
                          Appointment.add({start:start,end:end,patientID:newPatientID,userID:userID,service:service,status:eventStatus,clinic:clinic},function (appointment){ 
                            calendar.fullCalendar('renderEvent', appointment);
                            calendar.fullCalendar('unselect');
                            closeEditAppModal();
                            bFlagBookNext = false;
                            Appointment.addLog(appointment.id, 'New', 'New appointment created from Calendar','label-success');
                            Appointment.addLog(appointment.id, 'Email', 'Appointment confirmation sent','label-primary');
            });
                        
                      });
        } else {
          
          Appointment.add({start:start,end:end,patientID:patientID,userID:userID,service:service,status:eventStatus,clinic:clinic},function (appointment){
            renderRightPanelPatientAppointments();
            eventIDtoHighlight = appointment.id;
            highlightEvent = true;
            calendar.fullCalendar('renderEvent', appointment);
            calendar.fullCalendar('unselect');
            closeEditAppModal();        
            Appointment.addLog(appointment.id, 'New', 'New appointment created from Calendar','label-success');
            Appointment.addLog(appointment.id, 'Email', 'Appointment confirmation sent','label-primary');
            
            });
          fNewPatient = true;
          bFlagBookNext = false;
        }
      break;
      case 'editAppointment':
        
        
        var duration = $('#selectService :selected').attr('duration');
        objEvent.backgroundColor = objEvent.borderColor = $('#selectService :selected').attr('color');
        objEvent.patientID = patientID;
        objEvent.serviceId = $('#selectService').val();
        //var service = $('#selectService').val();				
				objEvent.end = objEvent.start.clone().add(duration, 'minutes');
        
        
        if (fNewPatient === true) {
            var aFullName = $('#patient-search').val().trim().replace(/ +(?= )/g, '').split(" ");
            var sFirstname = aFullName.pop();
            var sSurname = aFullName.join(" ");
          Patient.add(
                      {
                        surname: sSurname,
                        firstname: sFirstname,
                        phone: $('#phone').val(),
                        email: $('#email').val(),
                        practitioner: userID,
                        clinic: $('#clinicSelectEditApp').val()
                        
                      },function(newPatientID){
                        Appointment.update({id : objEvent.id,
                           start: objEvent.start.format(),
                           end : objEvent.end.format(),
                           patientID : newPatientID,
                           status : objEvent.status,
                           user : objEvent.resourceId,
                           service : objEvent.serviceId,
                           clinic: $('#clinicSelectEditApp').val()},
      
                           function(appointment){
                            calendar.fullCalendar('removeEvents' , objEvent.id );
                            calendar.fullCalendar('renderEvent', appointment);
                            closeEditAppModal();
          });
                        
                      });
          
        }else{
          Appointment.update({id : objEvent.id,
                           start: objEvent.start.format(),
                           end : objEvent.end.format(),
                           patientID : objEvent.patientID,
                           status : objEvent.status,
                           user : objEvent.resourceId,
                           service : objEvent.serviceId,
                           clinic: $('#clinicSelectEditApp').val()
                           },
                           function(appointment){
                            renderRightPanelPatientAppointments();
                            calendar.fullCalendar('removeEvents' , objEvent.id );
                            calendar.fullCalendar('renderEvent', appointment);
                            closeEditAppModal();
          },'no');
        }
      break;
    }


  });

  function closeEditAppModal() {
    $('#patient-search').autocomplete('close').val('');
    $('#editAppointment :input').val('');
    $('#ui-id-1').hide();
    $('.selected').hide();
    $('.patient-select').show();
    $('#editEvent').modal('hide');
  }
  

  $("#patient-search").autocomplete({
    autoFocus: true,
    source: function(request, response) {
      $.ajax({
        url: "ajax.php",
        dataType: "json",
        type: 'post',
        data: {
          com: 'calendar',
          task: 'searchPatients',
          name: request.term

        },
        success: function(data) {
          console.log(data);
          response($.map(data, function(item) {
            return {
              label: item.patient_surname + ' ' + item.patient_firstname + ' ' + item.dob,
              value: item.patient_surname + ' ' + item.patient_firstname,
              id: item.patient_id,
              email: item.email,
              dob: item.dob,
              phone: item.phone,
              clinic: item.clinic

            };
          }));

        }
      });
    },
    minLength: 3,
    select: function(event, ui) { //patient selected from the dropdown - get the vals en set mode to 'existingPatient'
      //patient id selected
      //mode = 'existingPatient';
      fNewPatient = false;
      log(ui.item.id + ' ' + ui.item.value);
      var patient_name = ui.item.value;
      var patient_id = ui.item.id;
      patientID = patient_id;
      eventTitle = patient_name;
      patientName = patient_name;
      patientLinkedClinic = ui.item.clinic;
      //insert selected values into modal
      $('.patient-select').hide();
      $('.selected').show();
      $('.selected-patient-name').html(patient_name);
      $('.selected-dob').html(ui.item.dob);
      $('.selected-telephone').html(ui.item.phone);
      $('.selected-email').html(ui.item.email);
      $('#editAppointment #phone').val(ui.item.phone).blur();
      $('#editAppointment :submit').focus();
        
      
      if( $('#clinicSelectEditApp').val() === null){
          $('#clinicSelectEditApp').val(ui.item.clinic);
          //render the services
          renderServicesLookup($('#clinicSelectEditApp').val());
      } else { //give a warning if selected clinic is different from the clinic the patient is linked to...
            if($('#clinicSelectEditApp').val() == patientLinkedClinic){
              $('.warningSelectClinic').hide();
            } else {
              $('.warningSelectClinic').show();
            }
      }
    
    },
    open: function() {
      $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
    },
    close: function() {
      $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
    }
  });
  // add this option so the search results are properly appended to the input box  
  $("#patient-search").autocomplete("option", "appendTo", ".patient-select");
  
  $('#editEvent').on('shown.bs.modal', function() {
    $('#patient-search').focus();
    
  });

  $('#clinicSelectEditApp').live('change', function() {
    log('changing');
    renderServicesLookup($('#clinicSelectEditApp').val());
    //give a warning if selected clinic is different from the clinic the patient is linked to...
    if(patientLinkedClinic !== null){ // if !== null there is no patient selected
      if($('#clinicSelectEditApp').val() == patientLinkedClinic){
        log('is equal');
        $('.warningSelectClinic').hide();
      } else {
        log('is not equal');
        $('.warningSelectClinic').show();
      }
    }
  });
  
  $('.clear-selected-patient').click(function() { //clear the selected patient and set fNewPatient to true
    fNewPatient = true;
    //mode = 'newPatient';
    $('.selected').hide();
    $('.patient-select').show();
    $('#editAppointment #patient-search #phone #email').val('');
    $('#ui-id-1').hide();
    $('#patient-search').autocomplete('close').val('');
    $('#patient-search').focus();
    patientLinkedClinic = null;
    $('.warningSelectClinic').hide();
    
  });

  $('.deleteAppointment').click(function(){
    log('deleting!!');
    Appointment.delete(objEvent.id,function(){
      calendar.fullCalendar('removeEvents' , objEvent.id );
      $('#customEventDetails').modal('hide');
    },function(){
      log('fail!!');
    });
  });


  //get all the services related to group or groups
  //$.ajax({
  //  type: "post",
  //  url: "ajax.php",
  //  dataType: "json",
  //  data: {
  //    com: 'calendar',
  //    task: 'getServices'
  //  }
  //}).success(function(data) {
  //  log(data);
  //  
  //  selectService = "<select id='selectService' name='selectService' class='form-control'>";
  //
  //  $.each(data, function() {
  //    if (this.default == 1) {
  //      iDefaultService = this.id;
  //    }
  //    selectService += "<option color =" + this.color + " duration=" + this.duration + " value=" + this.id + ">" + this.name + "</option>";
  //  });
  //  selectService += "</select>";
  //
  //  //$('.selectService').html(selectService);
  //
  //});
  




});

