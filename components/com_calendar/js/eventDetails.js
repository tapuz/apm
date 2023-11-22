var bFlagReschedule = false;
var bFlagBookNext = false;
var theLogs;
var getFreeRoomsForAppointment;

$(document).ready(function() {
  var tmpl_allocate_room = $('#tmpl_allocate_room').html();
 
	Mustache.parse(tmpl_allocate_room);
  


  //get the rooms to allocate

  getFreeRoomsForAppointment = function(){
    Clinic.getFreeRooms(clinicPresent,objEvent.resourceId,function(data){
      var rendered = Mustache.render(tmpl_allocate_room, { data: data });
      $('.appAllocateRoom').html(rendered);
      log(data);
    });
  }


  $(document).on('click','.set_status',function(){ 
 
    var newStatus = $(this).attr('status');
    objEvent.status = newStatus;

    Appointment.setStatus(objEvent.id, objEvent.status, function() {
      calendar.fullCalendar('updateEvent', objEvent);
      $('#eventDetails').modal('hide');
      switch (objEvent.status) {
        case '0':
          Appointment.addLog(objEvent.id,'Confirmed','Appointment confirmed','label-success');
        break;
        case '1':
          Appointment.addLog(objEvent.id,'Arrived','Patient arrived','label-success');
        break;
        case '2':
          Appointment.addLog(objEvent.id,'Pencilled','Appointment Pencilled','label-warning');
        break;
        case '8':
          Appointment.addLog(objEvent.id,'Did not show','Patient did not show','label-danger');
        break;
      }
      
    });

  });

 
  $(document).on('click','.btnEmptyRoom',function(){
    var room_id = $(this).data('room_id');
    var appointment_id = $(this).data('appointment_id');
    //allocate the patient to the room
    Clinic.emptyRoom(room_id,function(data){
      getRoomStatuses();
      Appointment.setStatus(appointment_id,9, function() {
        calendar.fullCalendar( 'refetchEvents' );
      });
      
        
    });
  });
  

  $(document).on('click','.btnAllocateRoom',function(){
    var room_id = $(this).data('room_id');
    var room_name = $(this).data('room_name');
    
    //log(room_id + ' is the room');
    //allocate the patient to the room
    Clinic.alocateAppointmentToRoom(objEvent.id,room_id,function(data){
      //set the status of the appointment to 3(allocated to a room)
      objEvent.status = 3;
      $('#eventDetails').modal('hide');
      Appointment.setStatus(objEvent.id, objEvent.status, function() {
        calendar.fullCalendar('updateEvent', objEvent);
        getRoomStatuses();
        
        Appointment.addLog(objEvent.id,'Allocated','Allocated to room ' + room_name  ,'label-success');
      });
      
        
    });
  });
    
    
  
  

  
  
  $(document).on('click','.reschedule',function(){ 
    //set the global flag to true.. the next event click on the calendar should fire a reschedule and not a new event        
    bFlagReschedule = true;
    $('#eventDetails').modal('hide');
    fcMessage = new Noty({
      text: '<span class="text-center">Choose a new time for this appointment</span><span class="pull-right"><i class="fa fa-times-circle">&nbsp;</i></span>',
      //closeWith:'click',
      layout:'top',
      theme:'sunset',
      type:'information',
      callbacks: {afterClose: function() {bFlagReschedule = false;}}
      }).show();
    
    
  });
  
  $(document).on('click','.booknext',function(){ 
 
    bFlagBookNext = true;
    fNewPatient = false;
    $('#eventDetails').modal('hide');
    fcMessage = new Noty({
      text: '<span class="text-center">Choose a time for the next appointment</span><span class="pull-right"><i class="fa fa-times-circle">&nbsp;</i></span>',
      //closeWith:'click',
      layout:'top',
      theme:'sunset',
      type:'information',
      callbacks: {afterClose: function() {bFlagBookNext = false;}}
      }).show();
    
    
    });
    
  $(document).on('click','.editapp',function(){    
  
    log(objEvent);
    $('#editEvent .modal-title').html('Edit appointment');
    appModalMode = 'editAppointment';
    fNewPatient = false;
    $('#editEvent .datetime').html(moment(objEvent.start).locale(locale).format('LLL'));
		$('#editEvent').modal('show');
		$('.patient-select #patient-search').val(objEvent.patientName); //if patient-search field is empty the save button will stay disabled.
		$('.patient-select').hide();
		$('.selected').show();

		$('.selected-patient-name').html(objEvent.patientName);
		$('.selected-dob').html(objEvent.dob);
		$('.selected-telephone').html(objEvent.phone);
    $('.selected-email').html(objEvent.email);
    renderServicesLookup(objEvent.clinic);	
		$('#selectService').val(objEvent.serviceId);
    $('#clinicSelectEditApp').val(objEvent.clinic);
    $('#note').val(objEvent.note);
		$('.patient-select #patient-search').blur();
    $('#editEvent').appendTo("body").modal('show');
    $('#eventDetails').modal('hide');
    
    if(objEvent.status == 2 ) {$('#editEvent .pencilled').button("toggle");}else{$('#editEvent .confirmed').button("toggle");}

    
    
    });

  $(document).on('click','.toggleCancelBox',function(){  
  
    $('.cancelBox').show();
    $('.appActions').hide();
    $('.appStatusActions').hide();
    $('.reasonForCancel').focus();
  });

  $(document).on('click','.cancelAppointment',function(){
  
    Appointment.addLog(objEvent.id, 'Cancelled', $('.reasonForCancel').val(),'label-danger');
    Appointment.setStatus(objEvent.id, 6, function() {
      log('setting the status !!');
      $('#eventDetails').modal('hide');
			objEvent.status = 6;
			calendar.fullCalendar('updateEvent',objEvent);
      //calendar.fullCalendar('removeEvents', objEvent.id);

    });

  });


  $(document).on('click','#eventDetails .delete',function(){
    Appointment.delete(objEvent.id,calendar.fullCalendar('removeEvents',objEvent.id));
    $('#eventDetails').modal('hide');


  });
  $(document).on('click','.history',function(){

		
		Appointment.getLog(eventID,'all',function(log){
				console.log(log);
				theLogs = log;
				var logs = '<br>';
				
				$.each(log, function(){
					logs += '<div class="log"><span class="label ' + this.labelclass + ' ">' + this.tag + ' &nbsp;</span><span class="logDateTime">'+ moment(this.datetime).format('LLLL') +'</span><span style="color:gray;"> - by ' + this.username + '</span>';
					logs += '<div>'+ this.log +'</div></div>';
	
				});
				
				$('.appHistoryBox').html(logs);
		});
		
		
    $('.history').toggleClass('active');
    $('.appHistoryBox').toggle();
    $('.appBox').toggle();
  });


  $(document).on('click','#eventDetails .editPatient',function(){
    $('#eventDetails').modal('hide');
    editPatient(objEvent.patientID);

    //$('#editPatient').modal('show');
    
    
    
  });
  
  $(document).on('click','#btn_goto_file',function(){
    $('#eventDetails').modal('hide');    
  });

  $(document).on('click','.btn_viewInvoices',function(){
    var invoiceWindow = window.open('index.php?com=invoice&view=list&patient_id=' + objEvent.patientID,objEvent.patientID) ;
    $('#eventDetails').modal('hide');    
  });
  
  $(document).on('click','#eventDetails .addPayment',function(){
    //get the Clinic to get the clinic name
    oClinic = clinics.find(x => x.clinic_id === objEvent.clinic.toString());
    //get the fee
    services = oClinic.services;
    oService = services.find(x => x.id === objEvent.serviceId.toString());
    log (oService);
    log(oClinic);
     $('#eventDetails').modal('hide');
     $('#paymentModal .payment_date').html(moment(objEvent.start).locale(locale).format('L'));
     $('#paymentModal .clinic').html(oClinic.clinic_name);
     $('#paymentModal .practitioner').html(objEvent.resourceName);
     $('#paymentModal .description').val(oService.description);
     $('#paymentModal .fee').val(oService.fee);
     $('#paymentModal').modal('show');
     log('CASTING');
     Payment.createPayment(5000,function(payment){
       log(payment._links.qrcode.href);
       cast.payment(payment);   
      });
     
  });

  $('#paymentModal .add_payment').click(function(){
    //register the payment
    Payment.add({patient_id : objEvent.patientID,
                 clinic_id : oClinic.clinic_id,
                 user : objEvent.resourceId,
                 //description : oService.description,
                 description: $('#paymentModal .description').val(),
                 //fee : oService.fee,
                 fee : $('#paymentModal .fee').val(),
                 method : $('#paymentMethod').val(),
                 date :  moment(objEvent.start)
                 },function(){
                 	objEvent.status = 7;
                    Appointment.setStatus(objEvent.id, 7, function() {
                     calendar.fullCalendar('updateEvent', objEvent);
    	            
                  });


                 });
  });

    $('#paymentModal .add_invoice').click(function(){
    //register the payment & create new invoice
    Payment.add({patient_id : objEvent.patientID,
                 clinic_id : oClinic.clinic_id,
                 user : objEvent.resourceId,
                 //description : oService.description,
                 description: $('#paymentModal .description').val(),
                 //fee : oService.fee,
                 fee : $('#paymentModal .fee').val(),
                 date :  moment(objEvent.start)
                },function() {var new_window = window.open('index.php?com=invoice&layout=component&view=edit_invoice&task=create_new_invoice&patient_id=' + objEvent.patientID,objEvent.patientID);

                             }
                );
    
  });
  
});


$(document).on('click','.loadPatientRightPanel',function(){
  loadPatientDetailsRightPanel( $(this).attr("patient_id"));
  $('#eventDetails').modal('hide');
});



function loadEventDetails() {
  $('#tab_busyTime').hide();

  //prepare the data
  objEvent.start_modified = moment(objEvent.start).locale(locale).format('LLLL');
  objEvent.end_modified = moment(objEvent.end).locale(locale).format('HH:mm');
  var tmpl_event_details = $('#tmpl_event_details').html();
  var rendered = Mustache.render(tmpl_event_details, { data: objEvent });
  $('#eventDetails .modal-content').html(rendered);
  
  $('#eventDetails').appendTo("body").modal('show');
  
  //set the status toggle
  if (objEvent.status == 0) {$(".set_status.confirmed").button("toggle");}
  if (objEvent.status == 1) {$(".set_status.arrived").button("toggle");}
  if (objEvent.status == 2) {$(".set_status.pencilled").button("toggle");}
  if (objEvent.status == 3) {
    $(".appStatusActions").hide();
    $(".editapp").hide();
    $(".appPencilledIn").hide();
    $(".toggleCancelBox").hide();
    $(".appAllocateRoom").hide();
    
    
  }
  if (objEvent.status == 8) {$(".set_status.dns").button("toggle");}
  if (objEvent.status == 6) {
      //get the cancelled log
      Appointment.getLog(eventID,'Cancelled',function(log){
        theLogs = log;
        var logs = '<br>';
        
        $.each(log, function(){
          logs += '<div class="log"><span class="label ' + this.labelclass + ' ">' + this.tag + ' &nbsp;</span><span class="logDateTime">'+ moment(this.datetime).format('LLLL') +'</span><span style="color:gray;"> - by ' + this.username + '</span>';
          logs += '<div><strong>Reason: '+ this.log +'</strong></div></div>';
  
        });
        
      $('.appCancelledBox').append(logs);
    });
      $(".appCancelledBox").show();
      $(".appActions .editapp").hide();
      $(".appActions .reschedule").hide();
      $(".appActions .toggleCancelBox").hide();
      $(".addPayment").hide();
      $(".appPencilledIn").hide();
  //$(".appActions").hide();
  $(".appStatusActions").hide();
  }
  if (objEvent.status == 7) {
    $(".addPayment").hide();
    $(".appStatusActions").hide();
    $(".appPencilledIn").hide();
    $(".toggleCancelBox").hide();
  }
  getFreeRoomsForAppointment();
}