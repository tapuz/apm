var oPatient,objEvent,objNewAppointment, oldEventStart, oldEventUsername, eventStart, eventEnd, eventAllDay, eventTitle, eventID, patientID, patientName, userID, userName, eventStatus;
var calendar;
var users;
var clinics; 
var clinicID='';
var selectedClinic = 'all';
var fcMessage;
var highlightEvent = false;
var eventIDtoHighlight;
var datepicker;
var selectedUser = "";

var cast;


showLoadingScreen();

//$('[data-time]:not(.fc-minor)');

$(document).ready(function() {
  
  //init the desk cast 
  cast = new Cast('https://desk.timegenics.com',currentUserID);
  //cast.castPayment();
  
  
	
  document.title = 'Calendar';
  window.name = 'calendar';
  //set some vars

  /*
	date store today date.
	d store today date.
	m store current month.
	y store current year.
	*/
  var date = new Date();
  var d = date.getDate();
  var m = date.getMonth();
  var y = date.getFullYear();


  var selectUser = "";
  //var selectedUser = "";
	

  var mode; //do not set this var as GLOBAL as it WILL interfere with other mode vars (ex. editEvent.js)!!
  //minify the main menu
  $('#main-menu-toggle').click();
  //hide the side panel
  
  $('#rightPanel').toggle();

	//append the modals to the body to avoid Z-index problems
	$('#editPatient').appendTo("body");
	$('#editEvent').appendTo("body");
  $('#paymentModal').appendTo("body");
  $('#customEventDetails').appendTo("body");
  $('#emailModal').appendTo("body");
  
  
  //set the progress bar
  var calendarPB = new NProgress({
    container:'#calendarPB',
    randomTrickle:true

  });


  // get users for the calendar select and init calendar for the selected user
  initCal();

  $('#calendar').prepend('<div style="height:1px;" id="calendarPB">&nbsp;</div>');


  $.ajax({
    type: "get",
    url: "ajax.php",
    dataType: "json",

    data: {
      com: 'calendar',
      task: 'getUsers'
    }
  }).done(function(data) {
    
		//store users 
    users = data;
		//log ('USERS--> ' + users);
    // make the practitioner selector 
    selectUser = "<select id='userSelect' name='userSelect' class='form-control' style='width:174px'>";
		if (Object.keys(data).length > 1){//there is > 1 user.. show all practitioners option
			selectUser += "<option value='all_practitioners'>All practitioners</option>";
		}
    $.each(data, function() {
      selectUser += "<option value=" + this.data.ID + ">" + this.data.display_name + "</option>";
    });

    selectUser += "</select>";


	  addSelectClinic();
		
    addSelectUser();

    
	  
    // check selectedUserID: if !=null then we have a practitioner who is logged in.. we want to show him his own calendar by default..
    // otherwise show first calendar in list

    userID = $('#selectedUserID').val();

    if (userID != 'none') {
      $("#userSelect").val(userID);
    } else {
      $("#userSelect").prop('selectedIndex',1)
    }

    selectedUser = $('#userSelect').val();
    calendar.fullCalendar('option', 'slotDuration',users[selectedUser].data.calSlotDuration);
    getEvents(selectedUser,function () {$('.loadingscreen').fadeOut('slow')});
    getResource(selectedUser);
    //log (users[selectedUser].data.workingPlan);

    
    renderWorkingPlan(users[selectedUser].data.workingPlan);

    $('#userSelect').on('change', function() {
      
      calendar.fullCalendar('removeEvents','not_working');
      calendar.fullCalendar('removeEvents','working');
      calendar.fullCalendar('removeEvents','break');

      calendar.fullCalendar('removeEventSources');
     
      if ($('#userSelect').val() == 'all_practitioners') {
        //get all the resources
        getResources();
        //change to day view
        calendar.fullCalendar('changeView', 'agendaDay');
        //set mode to 0
        mode = 0;
        //change the slot duration
        calendar.fullCalendar('option', 'slotDuration','00:10:00');

      } else {
        //remove the resources
        removeResources();
        selectedUser = $('#userSelect').val();
        console.log('refetching events for user : ' + selectedUser);
        getResource(selectedUser);
        getEvents(selectedUser);
        
        calendar.fullCalendar('option', 'slotDuration',users[selectedUser].data.calSlotDuration);
        
        


        renderWorkingPlan(users[selectedUser].data.workingPlan);
        //log(users[selectedUser].data.workingPlan);
       
        
        
        //set mode to 1
        mode = 1;
        //only show clinics in the clinic select the user is working in

      }

    });

  })
  .fail(function( jqxhr, textStatus, error ) {
    var err = textStatus + ", " + error;
    console.log( "Request Failed: " + err );
  });
	
	function addSelectClinic() {
		Clinic.getClinics(function(data){
			
			clinics = data;
			
			//render clinic select for the calendar
			var selectClinic = "<select id='clinicSelect' name='clinicSelect' class='form-control' style='width:250px'>";
			if (clinics.length > 1){
			selectClinic += "<option value='all'>All Clinics</option>";
			}
			$.each(clinics, function() {
				selectClinic += "<option value='"+ this.clinic_id + "'>"+ this.clinic_name +"</option>";
			});
			selectClinic += "</select>";
		
      //$('.fc-toolbar .fc-left').prepend(selectClinic);
      $('#calSelectToolbar form').prepend(selectClinic);
			
			//render clinic select for the editApp modal
			selectClinic = "<select id='clinicSelectEditApp' name='clinicSelectEditApp' class='form-control' style='width:250px'>";
			$.each(clinics, function() {
				selectClinic += "<option value='"+ this.clinic_id + "'>"+ this.clinic_name +"</option>";
			});
			selectClinic += "</select>";
			$('#editAppointment .selectClinic').html(selectClinic);
			
			//render clinic select for the editPatient modal
			selectClinic = "<select id='clinicSelectEditPatient' name='clinic' class='form-control' style='width:250px'>";
			$.each(clinics, function() {
				selectClinic += "<option value='"+ this.clinic_id + "'>"+ this.clinic_name +"</option>";
			});
			selectClinic += "</select>";
			$('#editPatient .selectClinic').html(selectClinic);
			//render the clinic select for the sendEmail modal
      selectClinic = "<select id='clinicSelectSendEmail' name='from' class='form-control'>";
			$.each(clinics, function() {
				selectClinic += "<option class='from' value='"+ this.clinic_id + "'>"+ this.clinic_email +"</option>";
			});
			selectClinic += "</select>";
			$('#emailModal .selectFrom').html(selectClinic);
			//update the validator..
			$('#editPatientForm').validator('update');
			$('#editAppointment').validator('update');
			
			//set the onchange for the calendar clinic selector
			$('#clinicSelect').on('change', function() {
				selectedClinic = $(this).val();
				//log (selectedClinic + ' is the clinic');
        calendar.fullCalendar('removeEvents','not_working');
      calendar.fullCalendar('removeEvents','working');
      calendar.fullCalendar('removeEvents','break');
        renderWorkingPlan(users[selectedUser].data.workingPlan);	
      
			switch(selectedClinic) {
				case 'all':
					
					$('.appointment').show();
        break;
				
				default:
					$('.appointment').hide();
					$('.clinic' + selectedClinic).show();
			}
				

			});	
			
		});
	}
	
  function addSelectUser() {
    //$('.fc-toolbar .fc-left').prepend(selectUser);
    $('#calSelectToolbar form').append(selectUser);
  }
 addPaymentMethods();
  function addPaymentMethods(){
    Payment.getMethods(function(methods){
    var selectPaymentMethod;
    $.each(methods, function() {
      selectPaymentMethod +=	"<option value='"+ this.id + "'>"+ this.method +"</option>";
    });
    
    $("#paymentMethod").html(selectPaymentMethod);

      
      log(methods);
    });
  }

  function getResources() {
    //add each user as a Resource
    $.each(users, function() {
      calendar.fullCalendar('addResource', {
        id: this.data.ID,
        title: this.data.display_name,
        eventColor: this.calendar_color

      });
      getEvents(this.data.ID);

    });
  }

  function getResource(id) {
    calendar.fullCalendar('addResource', {
      id: id,
      title: users[id].data.display_name  
    });
    
  }

  function removeResources() {
    $.each(users, function() {
      calendar.fullCalendar('removeResource', this.data.ID);
    });

  }


  function getEvents(userID,callback) {
    
   
    
    var events = {
      url: 'ajax.php',
      type: 'get',
      data: {
        com: 'calendar',
        task: 'get_data',
        user_id: userID,

      },
      beforeSend : function() {
        log ('START PB');
        calendarPB.start();
      }
    };

    calendar.fullCalendar('addEventSource', events);
    if (callback){callback();}

  }


  function renderWorkingPlan(workingPlan) {
    //log('the user is = ' + selectedUser);
    //var ev = $('#calendar').fullCalendar('clientEvents', function(evt) {
    //          return evt.thierry == 'yes';
    //        });
    //calendar.fullCalendar('removeEvents', ev);
         
    workingPlan = JSON.parse(workingPlan);
    

    //calendar.fullCalendar('removeEvents');
 
    
       $.each(workingPlan,function(){
        if(selectedClinic == 'all'){
          var color = this.color;
          var clinic = this.clinic;
          $.each(this.workingPlan,function(){
            
            $.each(this,function( day, dayplan ) {
                calendar.fullCalendar('renderEvent', {
                  id:'not_working', //all need the same ID, else you would get cumulative layer coloring
                  className: 'fc-nonbusiness',
                  start: dayplan.start,
                  end: dayplan.end,
                  dow: [dayplan.dow], 
                  rendering: 'inverse-background',
                  type:'bgEvent',
                  clinic:clinic
                },true);
                calendar.fullCalendar('renderEvent', {
                  id:'working', //all need the same ID, else you would get cumulative layer coloring
                  //id: clinic,
                  //className: className,
                  start: dayplan.start,
                  end: dayplan.end,
                  dow: [dayplan.dow], 
                  rendering: 'background',
                  type:'bgEvent',
                  color:color,
                  clinic:clinic
                },true);
              //render the breaks
              $.each(dayplan.breaks,function(){
                //log('break start:' + this.start + 'dow: ' + dayplan.dow);
                  calendar.fullCalendar('renderEvent', {
                  id:'break', //all need the same ID, else you would get cumulative layer coloring
                  className: 'fc-nonbusiness',
                  start: this.start,
                  end: this.end,
                  dow: [dayplan.dow], 
                  rendering: 'background',
                  type:'bgEvent',
                  clinc:clinic
                },true); 
              });   
            });
          });


        }else{ 
          
          if(this.clinic == selectedClinic){
            //log('WE HAVE A MATCH :' + this.clinic ); // only render this working plan
            var color = this.color
            $.each(this.workingPlan,function(){
              
              $.each(this,function( day, dayplan ) {
                  calendar.fullCalendar('renderEvent', {
                    id:'not_working', //all need the same ID, else you would get cumulative layer coloring
                    className: 'fc-nonbusiness',
                    start: dayplan.start,
                    end: dayplan.end,
                    dow: [dayplan.dow], 
                    rendering: 'inverse-background',
                    type:'bgEvent',
                    clinic:selectedClinic
                  },true); 

                  calendar.fullCalendar('renderEvent', {
                  id:'working', //all need the same ID, else you would get cumulative layer coloring
                  //id: clinic,
                  //className: className,
                  start: dayplan.start,
                  end: dayplan.end,
                  dow: [dayplan.dow], 
                  rendering: 'background',
                  type:'bgEvent',
                  color:color,
                  clinic:selectedClinic
                 
                },true);
                //render the breaks
              $.each(dayplan.breaks,function(){
                //log('break start:' + this.start + 'dow: ' + dayplan.dow);
                calendar.fullCalendar('renderEvent', {
                  id:'break', //all need the same ID, else you would get cumulative layer coloring
                  className: 'fc-nonbusiness',
                  start: this.start,
                  end: this.end,
                  dow: [dayplan.dow], 
                  rendering: 'background',
                  type:'bgEvent'
                },true);
              });   
              });
            });   
          } 
        } 
      }); 
    
  }

	



  //bring up the calendar
  function initCal() {


    calendar = $('#calendar').fullCalendar({
      //height: 800,   //set dynamically with $('#calendar').fullCalendar('option', 'height', 700);
      schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
      locale: locale,
			firstDay: 1,
      defaultView: 'agendaWeek',
      hiddenDays: [0],
      slotDuration: '00:15:00',
      snapDuration: '00:05:00',
      slotLabelInterval: '00:30:00',
      slotEventOverlap: 'false',
      weekNumbers: true,
      minTime: '07:30:00',
      maxTime: '21:30:00',
      slotLabelFormat: 'HH:mm',
      columnFormat: 'ddd D/M',
      titleFormat: 'D MMM YYYY',
      timeFormat: 'H(:mm)', // time format for the events displayed on the calendar
      scrollTime: '08:00:00',
      nowIndicator: 'true',
      displayEventTime: false,
			lazyFetching: true,
      eventLongPressDelay:500,
      selectLongPressDelay:500,
      longPressDelay:500,
      contentHeight:"auto",
      //allDaySlot: false,
	  
      //theme:'false',
      //allDayDefault: false,
      //contentHeight: 5000,
      googleCalendarApiKey: 'AIzaSyC83LJSULjyInMb17Der0h7FS0zd2KQ7lg',
      eventSources: [
        {
          googleCalendarId: 'nl.be#holiday@group.v.calendar.google.com'
        }
        
      ],
	  
      businessHours: {
        start: '07:00', // a start time (10am in this example)
        end: '23:30', // an end time (6pm in this example)

        dow: [1, 2, 3, 4, 5, 6]
          // days of week. an array of zero-based day of week integers (0=Sunday)
          // (Monday-Thursday in this example)
      },
      customButtons: {
        plus3m: {
          text: '+3M',
          click: function() {
            calendar.fullCalendar('incrementDate', {
              months: 3
            });
          }
        },
        plus2m: {
          text: '+2M',
          click: function() {
            calendar.fullCalendar('incrementDate', {
              months: 2
            });
          }
        },
        plus1m: {
          text: '+1M',
          click: function() {
            calendar.fullCalendar('incrementDate', {
              months: 1
            });
          }
        },
        plus6w: {
          text: '+6w',
          click: function() {
            calendar.fullCalendar('incrementDate', {
              weeks: 6
            });
          }
        },
        plus3w: {
          text: '+3w',
          click: function() {
            calendar.fullCalendar('incrementDate', {
              weeks: 3
            });
          }
        },
        plus2w: {
          text: '+2w',
          click: function() {
            calendar.fullCalendar('incrementDate', {
              weeks: 2
            });
          }
        },
        refreshCalendar: {
          icon:'fa fa-refresh',
          
          click: function() {
            calendar.fullCalendar( 'refetchEvents' );
          
          }
      },
        
				
		toggleSidebarRight:{
			//text: '<i class="fa fa-chevron-left"',
			icon: 'fa fa-chevron-right',
			click: function() {
				$('#calendar').toggleClass('col-md-9');
				$('#calendar').toggleClass('col-md-12');
				$('#rightPanel').toggle();
				$('#rightPanel .patient-search').focus();
				
					}
				}
      },
			
      /*
					header option will define our calendar header.
					left define what will be at left position in calendar
					center define what will be at center position in calendar
					right define what will be at right position in calendar
				*/

      header: {
        left: 'prev,next today plus2w,plus3w,plus6w plus1m,plus2m,plus3m refreshCalendar',
        center: 'title',
        right: 'agendaDay,agendaWeek,month toggleSidebarRight'
          //        left: 'add,sell,locationSelect,staffSelect',
          //        center: 'prev,jumpLeft,today,title,jumpRight,next',
          //        right: 'resourceDay,agendaWeek,month'

      },

      /*
      	selectable:true will enable user to select datetime slot
      	selectHelper will add helpers for selectable.
      */
      selectable: true,
      selectHelper: true,
      editable: true,
      resources: [],
      /*
      	when user select timeslot this option code will execute.
      	It has three arguments. Start,end and allDay.
      	Start means starting time of event.
      	End means ending time of event.
      	allDay means if events is for entire day or not.
      */
      /* function(start, end, allDay, event, resourceId) {*/
      select: function(start, end, jsEvent, view, resource) {
        $('#editEvent .nav-pills a[href="#patientAppointment"]').tab('show');
        $('#tab_busyTime').show();
        if (bFlagBookNext == true) {
          //bring up the add appointment modal
          //set the patient as selected
          //set the service as selected
					appModalMode = 'newAppointment';



          $('#editEvent .modal-title').html('Book next appointment');
					$('#editEvent .datetime').html(moment(start).locale(locale).format('LLL'));
          $('#editEvent').appendTo("body").modal('show');
          $('.patient-select #patient-search').val(objNewAppointment.patientName); //if patient-search field is empty the save button will stay disabled.
					$('.patient-select #phone').val(objNewAppointment.phone); //if patient-search field is empty the save button will stay disabled.
					
          $('.patient-select').hide();
          $('.selected').show();
          $('#editEvent .confirmed').button("toggle");

          $('.selected-patient-name').html(objNewAppointment.patientName);
          $('.selected-dob').html(objNewAppointment.dob);
          $('.selected-telephone').html(objNewAppointment.phone);
          $('.selected-email').html(objNewAppointment.email);

          if (selectedClinic != 'all'){
            $('#clinicSelectEditApp').val(selectedClinic);
            renderServicesLookup(selectedClinic);
            $('#selectService').val(iDefaultService);
          } else if (clinicID != '') {
            //get the clinic id from the background event if it exists
            $('#clinicSelectEditApp').val(clinicID);
            renderServicesLookup(clinicID);
            $('#selectService').val(iDefaultService);
            clinicID ='';
          } else {
            $('.selectService').html('Select a clinic first');
            $('#clinicSelectEditApp').val('');
          }

          
          $('.patient-select #patient-search').blur();
					$('.warningSelectClinic').hide();
					fcMessage.close();

          eventStart = start;
          eventEnd = end;
          //eventAllDay = allDay;
          if (mode === 0) { //we are in resource mode .. we can get the resource.id without getting an error
            userID = resource.id;
            //log(resourceID + 'is the resource');
          } else {
            userID = selectedUser;
          }
          return;
        }
        //check if in reschedule mode...
        if (bFlagReschedule === true) {
          oldEventStart = objEvent.start;
          var bFlagRefetchEventsAfterReschedule = false;
					oldEventUsername = users[objEvent.resourceId].data.display_name;


          if (mode === 0) { //we are in resource mode .. we can get the resource.id without getting an error
            objEvent.resourceId = resource.id;
            var newEventUsername = users[resource.id].data.display_name;

          } else {
            var newEventUsername = users[selectedUser].data.display_name;
            if (objEvent.resourceId != selectedUser) {
              bFlagRefetchEventsAfterReschedule = true;
              objEvent.resourceId = selectedUser;
            }
          }
          var duration = moment.duration(objEvent.end.diff(objEvent.start));



          objEvent.start = start;
          objEvent.end = start.clone().add(duration);

         log(clinicID + ' is CLINIC and OBJ.clinic ' + objEvent.clinic);
         
        
           

         if (selectedClinic != 'all'){
            clinic = selectedClinic;
            
            if(objEvent.clinic != selectedClinic ){ 
              // user needs to confirm that appoinment is to be moved to different clinic
              showConfirm('Reschedule to different clinic?').then(function(result){
                if(result){objEvent.clinic = selectedClinic;updateAppointment();}
                
              });
            }else{updateAppointment();}
              
              
            
          } else if (clinicID != ''){
            clinic = clinicID;
            
            //clinicID = '';
            if(objEvent.clinic != clinicID ){
              showConfirm('Reschedule to different clinic?').then(function(result){
                if(result){objEvent.clinic = clinicID;updateAppointment();}
                
              });
            }else{objEvent.clinic = clinicID;updateAppointment()};
            
          }else{ 
            clinic = objEvent.clinic;
            updateAppointment();
            

          }

         

          function updateAppointment(){
            calendar.fullCalendar('removeEvents', objEvent.id);
            calendar.fullCalendar('renderEvent',objEvent );
            calendar.fullCalendar('unselect');
            Appointment.update({
              id: objEvent.id,
              start: objEvent.start.format(),
              end: objEvent.end.format(),
              user: objEvent.resourceId,
              patientID: objEvent.patientID,
              service: objEvent.serviceId,
              status: objEvent.status,
              note:objEvent.note,
              clinic: clinic
            }, function() {
              renderRightPanelPatientAppointments();
              if (bFlagRefetchEventsAfterReschedule === true) {
                calendar.fullCalendar('refetchEvents');
              }
    
              if (oldEventUsername != newEventUsername) {
                Appointment.addLog(objEvent.id, 'Rescheduled', 'appointment changed from ' + oldEventUsername + ' - ' + moment(oldEventStart).locale(locale).format('LLL') + ' to ' + newEventUsername + ' - ' + moment(objEvent.start).locale(locale).format('LLL'), 'label-warning');
              } else {
                Appointment.addLog(objEvent.id, 'Rescheduled', 'appointment changed from ' + moment(oldEventStart).locale(locale).format('LLL') + ' to ' + moment(objEvent.start).locale(locale).format('LLL'), 'label-warning');
              }
              Appointment.addLog(objEvent.id, 'Email', 'Appointment amendment sent','label-primary');
              
            },1); //true = send email

          }

					fcMessage.close();
          fcMessage.close();
          bFlagReschedule = false;

          return;

        }

        //bring up the modal and push start and end into global vars
        $('#editEvent .modal-title').html('Book Appointment');
				$('.clear-selected-patient').click();
        //$("#editAppointment")[0].reset();
        $('#editEvent .datetime').html(moment(start).locale(locale).format('LLL'));
        appModalMode = 'newAppointment';
        $('#editEvent').modal('show');
        $('#editEvent :input').val('');
				$('#editEvent .confirmed').button("toggle");
				log('selected clinic is : ' + selectedClinic);
				if (selectedClinic != 'all'){
          $('#clinicSelectEditApp').val(selectedClinic);
					renderServicesLookup(selectedClinic);
					$('#selectService').val(iDefaultService);
				} else if (selectedClinic == 'all') {
          //get the clinic id from the background event if it exists
          if (clinicID != '' || void(0)){
          log('the clinic id from BG is : ' + clinicID);
          $('#clinicSelectEditApp').val(clinicID);
          renderServicesLookup(clinicID);
					$('#selectService').val(iDefaultService);
          clinicID ='';

				} else {
         
          $('.selectService').html('Select a clinic first');
        }
        }
				$('.warningSelectClinic').hide();
        eventStart = start;
        eventEnd = end;
        //eventAllDay = allDay;
        if (mode === 0) { //we are in resource mode .. we can get the resource.id without getting an error
          userID = resource.id;
          //log(resourceID + 'is the resource');
        } else {
          userID = selectedUser;
        }

      },
      eventClick: function(event, jsEvent, view) {
        objEvent = event;
        objNewAppointment = event; //used for book next appointment
        eventID = event.id; //set the global var of eventID
        patientID = event.patientID;

        if(event.customAppointment==true){
          //customAppModalMode='editCustomAppointment';
          $('#customEventDetails').modal('show');
          $('#customEventDetails .datetime').html(moment(event.start).locale(locale).format('LLL'));
          
          
          var duration = event.end.diff(event.start, 'minutes');

          $('#customEventDetails .duration').html(duration);
          $('#customEventDetails .description').html(event.title);  

 
        }else{
          loadEventDetails();
        }

      },
      eventDragStart: function(event, jsEvent, ui, view) {
        //log('start draggin!');
        oldEventStart = event.start;
        oldEventUsername = event.resourceName;
        


      },

      eventDrop: function(event, delta, revertFunc) {
        objEvent = event;
        //if we have a customAppointment-> no need for confirmation and we need a different appointment update
        if(event.customAppointment == 1){
           Appointment.updateCustom({
									id: event.id,
                  start: event.start.format(),
                  end: event.end.format(),
                  note:event.note,
                  user: event.resourceId
                 
              }, function() {
                
               //do stuff?
              } ,function() { //true = send email 
					revertFunc();
					});

        } else {

        
       if (selectedClinic != 'all'){
            clinic = selectedClinic;
            
            if(objEvent.clinic != selectedClinic ){ 
              // user needs to confirm that appoinment is to be moved to different clinic
              showConfirm('Reschedule to different clinic?').then(function(result){
                if(result){objEvent.clinic = selectedClinic;updateAppointment();}else{revertFunc();}
                
              });
            }else{updateAppointment();}
              
              
            
          } else if (clinicID != ''){
            clinic = clinicID;
        
            if(objEvent.clinic != clinicID ){
              showConfirm('Reschedule to different clinic?').then(function(result){
                if(result){objEvent.clinic = clinicID;updateAppointment();}else{revertFunc();}
                
              });
            }else{objEvent.clinic = clinicID;updateAppointment()};

          }else{
            clinic = objEvent.clinic;
            updateAppointment();

          }

          function updateAppointment(){
            var sendEmail=false;
            calendar.fullCalendar('updateEvent', objEvent); 
            showConfirm('Send amendment email to patient? ').then(function(result){
              if(result){var sendEmail=true};
              Appointment.update({
                id: objEvent.id,
                patientID: objEvent.patientID,
                start: objEvent.start.format(),
                end: objEvent.end.format(),
                user: objEvent.resourceId,
                service: objEvent.serviceId,
                status: objEvent.status,
                note:objEvent.note,
                clinic: clinic
        
                }, function() {
                  renderRightPanelPatientAppointments(); 
                  event.resourceName = users[event.resourceId].data.display_name;
                  var newEventUsername = event.resourceName;
                  
                  if (oldEventUsername != newEventUsername) {
                    Appointment.addLog(objEvent.id, 'Rescheduled', 'appointment changed from ' + oldEventUsername + ' - ' + moment(oldEventStart).locale(locale).format('LLL') + ' to ' + newEventUsername + ' - ' + moment(objEvent.start).locale(locale).format('LLL'), 'label-warning');
                  } else {
                    Appointment.addLog(objEvent.id, 'Rescheduled', 'appointment changed from ' + moment(oldEventStart).locale(locale).format('LLL') + ' to ' + moment(objEvent.start).locale(locale).format('LLL'), 'label-warning');
                  }
                  Appointment.addLog(objEvent.id, 'Email', 'Appointment amendment sent','label-primary');
                  
                }, sendEmail ,function() { //true = send email 
                            revertFunc();
      });
              
            });
           
				    

          }

      }
    },

      eventResize: function(event, delta, revertFunc) {

        if(event.customAppointment == 1){
        
          Appointment.updateCustom({
                 id: event.id,
                 start: event.start.format(),
                 end: event.end.format(),
                 user: event.resourceId
                
             }, function() {
                
                  log ('app updated');
                },function () {
            revertFunc();
            });
      }else{

        Appointment.update({
            id: event.id,
                patientID: event.patientID,
                start: event.start.format(),
                end: event.end.format(),
                user: event.resourceId,
                service: event.serviceId,
                status:event.status,
                clinic: event.clinic
                }, function() {
                  
                  log ('app updated');
                }, 'no' ,function () {
            revertFunc();
            });
				
      }
      },


      eventRender: function(event, element) {
				
        //calendarPB.start();
        icons = '<div class="fc-event-icons"><i class="fa fa-thumbs-down icon-thumbs-down tip-init" data-original-title="Did not show" title="Did not show"></i>';
        icons += '<i class="fa fa-thumbs-up icon-thumbs-up tip-init" title="Arrived"></i>';
        icons += '<i class="fas fa-comment icon-note title="note"></i>';
        icons += '<i class="far fa-credit-card icon-payed" title="payed"></i>';       
        icons += '<i class="fas fa-cloud icon-cloud" title="cloud"></i></div>';       
        
        
        
        patid = '<span class="note">' + event.patientID + ' </span>';
        $(".fc-content", element).append(icons);
        if((users[selectedUser].data.showpatIDinCalendar)==1){
          $(".fc-content", element).append(patid);
        }
				
            if (event.insurance === null || event.insurance === undefined){
              insurance = '';
            }else{
              insurance = '<span class="event_insurance">[' + event.insurance + ']<span>';
            }
            
            log(event.note);

            if (event.note === null || event.note === undefined || event.customAppointment == 1 || event.note ==''){
              $(element).find('.icon-note').hide();
            
            }else{
              
              $(element).find('.icon-note').show();
              
            }

            if (event.madeOnline == 1) {
              $(element).find('.icon-cloud').show();
            } else {
              $(element).find('.icon-cloud').hide();
            }
           
            
            
            //log(showPatientID);
            $(".fc-title", element).append(insurance);
            //if (showPatientID){$(".fc-content", element).append(patid);}
            
            //$(".fc-content", element).append(note);
            
          
            if (event.status == 1) {
              $(element).find('.icon-thumbs-up').show();
            } else {
              $(element).find('.icon-thumbs-up').hide();
            }

            if (event.status == 8) {
              $(element).find('.icon-thumbs-down').show();
            } else {
              $(element).find('.icon-thumbs-down').hide();
            }

            if (event.status == 6) {
              $(element).find('.fc-title').addClass('appointmentCancelled');
            }

            if (event.status == 7) {
              $(element).find('.icon-payed').show();
            } else {
              $(element).find('.icon-payed').hide();
            }

            if (event.status == 2) {
              
              //$(element).addClass('appToBeMoved');
              rgba1 = hexToRGBA(event.backgroundColor,1);
              rgba2 = hexToRGBA(event.backgroundColor,0.5);
              $(element).css({"background": "repeating-linear-gradient(45deg,"+ rgba1 +","+ rgba1  +" 10px,"+rgba2+" 10px,"+rgba2+" 20px)","opacity":"1"});
              $(element).find('.fc-bg').css({"opacity":"0.6"});
            }

            

            if (event.type != 'bgEvent'){ //bgEvent is used to display the working plan
              element.addClass('clinic' + event.clinic);
              element.addClass('appointment');
            }

            if (event.customAppointment == 1){
              element.addClass('customAppointment');
              element.removeClass('appointment');

              };
           
        

        
        if (highlightEvent === true){
          if (event.id == eventIDtoHighlight){
            highlightEvent = false;
            element.addClass('run-long-pop-animation');
            
          }
          
        }
        
    

      },
			
			eventAfterAllRender: function (view) {
				//log("after render");
				//log(selectedClinic + ' is selected');
				if (selectedClinic == 'all') {
					//show events for all clinics
					$('.appointment').show();
					//log('showing all appointments');
        
				} else {
        //show events for selected clinic
					$('.appointment').hide();
          $('.clinic' + selectedClinic).show();
          //$('.customAppointment').show();
					//log('showing only specific clinic');
        }
        
        log('all is rendered!!');
        if(calendarPB.isStarted())calendarPB.done();
        
        //renderCalendarTimes();

			},

      viewRender: function(view, element) {
        if (view.name == 'agendaWeek') {renderCalendarTimes();}
        else{
          removeCalendarTimes();
        } 
       

      },
      selectOverlap: function(event) {
        //Little trick to get BG event details (clinic id etc..)
        //if the function returns true it will allow the selection
        console.log('BG event ' + event.clinic);
        clinicID = event.clinic;
        return true;
      },

      eventOverlap: function(stillEvent, movingEvent) {
        
        clinicID = stillEvent.clinic;
        //if (movingEvent.customAppointment == 1){return true;}
       
       // if ( movingEvent.clinic == stillEvent.clinic){
        //  return true;
        //}else{
         
        
        return true;
       
        


 //    }
    }




    }); // end calendar

    //repeat the calendar times
   

  } // end initCal()

  $('.tip-init').tooltip();


  function renderCalendarTimes(){
    $( "tr[data-time]" ).not('.fc-minor').each(function() {
      var time = $( this ).find("td").first().find("span").html();
      var html = '<div class="fc-slot-times" style="position:relative"><div class="fc-slot-time"><span class="fc-slot-time-inner">'+time+'&nbsp;&nbsp;&nbsp;&nbsp;</span></div><div class="fc-slot-time"><span class="fc-slot-time-inner">'+time+'&nbsp;&nbsp;&nbsp;&nbsp;</span></div><div class="fc-slot-time"><span class="fc-slot-time-inner">'+time+'&nbsp;&nbsp;&nbsp;&nbsp;</span></div><div class="fc-slot-time"><span class="fc-slot-time-inner">'+time+'&nbsp;&nbsp;&nbsp;&nbsp;</span></div><div class="fc-slot-time"><span class="fc-slot-time-inner">'+time+'&nbsp;&nbsp;&nbsp;&nbsp;</span></div><div class="fc-slot-time"><span class="fc-slot-time-inner">'+time+'&nbsp;&nbsp;&nbsp;&nbsp;</span></div>';
      $(this).find("td").last().html(html);
    });
  }

  function removeCalendarTimes(){
    $( "tr[data-time]" ).not('.fc-minor').each(function() {
      //var time = $( this ).find("td").first().find("span").html();
      var html = '';
      $(this).find("td").last().html(html);
    });
  }
	 
	
});

//outside document ready

function getClinicName(clinic_id){
  oClinic = clinics.find(x => x.clinic_id === clinic_id.toString());
  return oClinic.clinic_name;
}

function renderServicesLookup(clinic_id){
  try{  
  selectService = "<select id='selectService' name='selectService' class='form-control'>";
    
		oClinic = clinics.find(x => x.clinic_id === clinic_id.toString());
		log('here comes the c!!');
    log(oClinic);
   
		  $.each(oClinic.services, function() {
		    if (this.default == 1) {
		      iDefaultService = this.id;
		    }
		    selectService += "<option color =" + this.color + " duration=" + this.duration + " value=" + this.id + ">" + this.name + "</option>";
		  });
    selectService += "</select>";

    $('.selectService').html(selectService);
  }catch(error){}
	}	


  