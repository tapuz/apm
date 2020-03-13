var bFlagReschedule = false;
var bFlagBookNext = false;
var theLogs;
$(document).ready(function() {

  $('.set_status').live("click", function() {
    var newStatus = $(this).attr('status');
    objEvent.status = newStatus;

    Appointment.setStatus(objEvent.id, objEvent.status, function() {
      calendar.fullCalendar('updateEvent', objEvent);
      $('#eventDetails').modal('hide');
      switch (objEvent.status) {
        case '1':
          Appointment.addLog(objEvent.id,'Arrived','Patient arrived','label-success');
        break;
        case '8':
          Appointment.addLog(objEvent.id,'Did not show','Patient did not show','label-danger');
        break;
      }
      
    });

  });


  $('.reschedule').live("click", function() {
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
  
  $('.booknext').live("click",function(){
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
    
  $('.editapp').live("click",function(){
    
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
    
    
    
    });


  $('.toggleCancelBox').live("click", function() {
    $('.cancelBox').show();
    $('.appActions').hide();
    $('.appStatusActions').hide();
    $('.reasonForCancel').focus();
  });

  $('.cancelAppointment').live("click", function() {
    Appointment.addLog(objEvent.id, 'Cancelled', $('.reasonForCancel').val(),'label-danger');
    Appointment.setStatus(objEvent.id, 6, function() {
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

  $('.history').live("click", function() {
		
		Appointment.getLog(eventID,function(log){
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



  $('#eventDetails .editPatient').live("click",function(){
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
     log(objEvent);
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
                 date :  moment(objEvent.start)
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
                });
    var new_window = window.open('index.php?com=invoice&layout=component&view=edit_invoice&task=create_new_invoice&patient_id=' + objEvent.patientID,objEvent.patientID) ;
  });
  
});


$(document).on('click','.loadPatientRightPanel',function(){
  loadPatientDetailsRightPanel( $(this).attr("patient_id"));
  $('#eventDetails').modal('hide');
});



function loadEventDetails() {
      $('#tab_busyTime').hide();
      var title ='<a class="btn btn-sm loadPatientRightPanel" patient_id="'+objEvent.patientID+'">' + objEvent.patientName + '&nbsp;&nbsp;- '+objEvent.insurance+'&nbsp;&nbsp;&nbsp;<i class="fa fa-pencil-square-o">&nbsp;</i></a>';
			var body='';
			title +='<div>';
			if (objEvent.phone != null){
				title += '&nbsp;&nbsp;<a href="tel:' + objEvent.phone + '"><i class="fa fa-phone">&nbsp;</i>' + objEvent.phone + '</a>&nbsp;&nbsp';
			}
			
			if (objEvent.email != null){
				title += '<a href="mailto:' + objEvent.email + '"><i class="fa fa-envelope-o">&nbsp;</i>' + objEvent.email + '</a>';
			}
			title += '</div>';
			
			
			body += '<span class="pull-right"><a class="btn btn-info btn-sm history"><i class="fa fa-list-alt fa-fw"></i>&nbsp;History</a></span>';
			body += '<div class="appHistoryBox" style="display:none">Loading...</div>';
			body += '<div class="appBox">';
			body += '<p><i class="fa fa-user summary"></i>&nbsp;' + objEvent.resourceName + '</p>';

			body += '<p><i class="fa fa-clock-o summary"></i>&nbsp;' + moment(objEvent.start).locale(locale).format('LLLL') + ' &mdash; ' + moment(objEvent.end).format('HH:mm') + '</p>';
      if (objEvent.note != ''){
        body += '<p><i class="far fa-sticky-note"></i><strong> ' + objEvent.note + ' </strong><a href="#" class="editapp">edit</a></p>';
      };
			body += '<p><div class="btn-group appActions" role="group" aria-label="btnGrpEditEvents">';
			body +='<button type="button" class="btn btn-primary editapp"><i class="fa fa-pencil-square-o"></i>&nbsp;Edit</button>';
			body +='<button type="button" class="btn btn-primary reschedule"><i class="fa fa-calendar"></i>&nbsp;Reschedule</button>';
      body +='<button type="button" class="btn btn-primary booknext"><i class="fa fa-refresh"></i>&nbsp;Book Next</button>';
			body +='<button type="button" class="btn btn-danger toggleCancelBox"><i class="fas fa-slash"></i>&nbsp;Cancel</button>';  
      body +='<button type="button" class="btn btn-danger delete"><i class="fa fa-trash-o"></i>&nbsp;Delete</button>';
      body +='</div></p>';
	
			
			body += '<div class="cancelBox input-group" style="display:none">';
			body += '<input type="text" placeholder="Reason for cancellation" class="form-control reasonForCancel"><span class="input-group-btn"><button type="button" class="btn btn-danger cancelAppointment"><i class="fas fa-slash"></i>&nbsp;Cancel</button></span>';
			body += '</div>';
			
			body += '<div class="appCancelledBox" style="display:none">';
			body +='<h2 class="text-danger">Appointment was cancelled</h2></div>';
			
			
			body += '<div class="btn-group appStatusActions" data-toggle="buttons">';
			body +=	'<label id="1" class="set_status arrived btn btn-sm" status="1" checked><input type="radio"> Arrived</label>';
			body +=	'<label id="2" class="set_status dns btn btn-sm" status="8"><input type="radio"> Did not show</label>';
			body += '</div>';
      
      body += '<p><div class="btn-group">';

			body +='<a id="btn_goto_file" type="button" target="'+ objEvent.patientID +'"  href = "index.php?com=patient&view=patient&patient_id=' +objEvent.patientID  + '" class="btn btn-primary gotoFile"><i class="fa fa-file-text-o" aria-hidden="true"></i>&nbsp;Open File</a>';
      body +='<button type="button" class="btn btn-success addPayment"><i class="fa fa-eur" aria-hidden="true"></i>&nbsp;Add Payment</button>';
      body +='<button type="button" class="btn btn-success btn_viewInvoices"><i class="fa fa-eur" aria-hidden="true"></i>&nbsp;View Invoices</button>';
      body += '</div></p>';
			
			body += '</div>'; //end appBox
			
			$('#eventDetails .modal-title').html(title);
			$('#eventDetails .modal-body').html(body);
		
      $('#eventDetails').appendTo("body").modal('show');
      
			//set the status toggle
			
			if (objEvent.status == 1) {$(".set_status.arrived").button("toggle");}
			if (objEvent.status == 8) {$(".set_status.dns").button("toggle");}
			if (objEvent.status == 6) {
        $(".appCancelledBox").show();
        $(".appActions .editapp").hide();
        $(".appActions .reschedule").hide();
        $(".appActions .toggleCancelBox").hide();
				//$(".appActions").hide();
				$(".appStatusActions").hide();
				}
}