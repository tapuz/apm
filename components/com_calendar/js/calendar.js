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
var calSwipeDisabled = false;

var cast;
var customWorkingSlotsRequestToken = 0;

function getClinicColorFromWorkingPlan(userId, clinicId) {
  var workingPlanUserId = userId || selectedUser;

  if (!workingPlanUserId || !users || !users[workingPlanUserId] || !users[workingPlanUserId].data || !users[workingPlanUserId].data.workingPlan) {
    return null;
  }

  var workingPlan;
  try {
    workingPlan = JSON.parse(users[workingPlanUserId].data.workingPlan);
  } catch (error) {
    return null;
  }

  var clinicKey = clinicId != null ? clinicId.toString() : '';

  for (var index = 0; index < workingPlan.length; index++) {
    if (workingPlan[index].clinic != null && workingPlan[index].clinic.toString() === clinicKey) {
      return workingPlan[index].color || null;
    }
  }

  return null;
}

function buildDateTime(referenceDate, timeValue) {
  if (!referenceDate || !timeValue) {
    return null;
  }

  var normalizedTime = timeValue.toString().length === 5 ? timeValue + ':00' : timeValue;
  var dateTime = moment(referenceDate.format('YYYY-MM-DD') + ' ' + normalizedTime, ['YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD HH:mm']);

  return dateTime.isValid() ? dateTime : null;
}

function subtractIntervals(baseInterval, blockedIntervals) {
  var openIntervals = [{
    start: baseInterval.start.clone(),
    end: baseInterval.end.clone()
  }];

  $.each(blockedIntervals, function() {
    var blocker = this;
    var nextOpenIntervals = [];

    $.each(openIntervals, function() {
      var segment = this;

      if (blocker.end.isSameOrBefore(segment.start) || blocker.start.isSameOrAfter(segment.end)) {
        nextOpenIntervals.push(segment);
        return true;
      }

      if (blocker.start.isAfter(segment.start)) {
        nextOpenIntervals.push({
          start: segment.start.clone(),
          end: blocker.start.clone().isBefore(segment.end) ? blocker.start.clone() : segment.end.clone()
        });
      }

      if (blocker.end.isBefore(segment.end)) {
        nextOpenIntervals.push({
          start: blocker.end.clone().isAfter(segment.start) ? blocker.end.clone() : segment.start.clone(),
          end: segment.end.clone()
        });
      }
    });

    openIntervals = nextOpenIntervals;
  });

  return openIntervals;
}

function mergeIntervalsByClinic(intervals) {
  intervals.sort(function(first, second) {
    if (first.clinic !== second.clinic) {
      return first.clinic < second.clinic ? -1 : 1;
    }

    if (first.start.isBefore(second.start)) {
      return -1;
    }

    if (first.start.isAfter(second.start)) {
      return 1;
    }

    if (first.end.isBefore(second.end)) {
      return -1;
    }

    if (first.end.isAfter(second.end)) {
      return 1;
    }

    return 0;
  });

  var mergedIntervals = [];

  $.each(intervals, function() {
    var currentInterval = this;
    var previousInterval = mergedIntervals[mergedIntervals.length - 1];

    if (previousInterval && previousInterval.clinic == currentInterval.clinic && currentInterval.start.isSameOrBefore(previousInterval.end)) {
      if (currentInterval.end.isAfter(previousInterval.end)) {
        previousInterval.end = currentInterval.end.clone();
      }

      if (!previousInterval.color && currentInterval.color) {
        previousInterval.color = currentInterval.color;
      }

      return true;
    }

    mergedIntervals.push({
      start: currentInterval.start.clone(),
      end: currentInterval.end.clone(),
      clinic: currentInterval.clinic,
      resourceId: currentInterval.resourceId,
      color: currentInterval.color
    });
  });

  return mergedIntervals;
}

function setCustomWorkingPlanButtonVisibility(visible) {
  var button = $('.fc-showCustomTimeslots-button');
  if (!button.length) {
    return;
  }

  if (visible) {
    button.show();
  } else {
    button.hide();
  }
}

function loadWorkingPlanBackgrounds(viewDate) {
  if (!calendar) {
    return;
  }

  var requestToken = ++customWorkingSlotsRequestToken;
  var currentDate = moment(viewDate || calendar.fullCalendar('getDate')).format('YYYY-MM-DD');

  calendar.fullCalendar('removeEvents', function(event) {
    return event.customWorkingSlot == 1;
  });

  if (!selectedUser || selectedUser === 'all_practitioners') {
    setCustomWorkingPlanButtonVisibility(false);
    return;
  }

  Appointment.getCustomTimeslots(selectedUser, currentDate, function(data) {
    if (requestToken !== customWorkingSlotsRequestToken) {
      return;
    }

    setCustomWorkingPlanButtonVisibility(data && data.length > 0);
    renderWorkingPlan(users[selectedUser].data.workingPlan, data);
  });
}

function renderWorkingPlan(workingPlan, customWorkingSlots) {
  var currentView = calendar.fullCalendar('getView');
  var viewName = currentView.name;
  var viewStart = moment(currentView.start).clone().startOf('day');
  var viewEnd = moment(currentView.end).clone().startOf('day');
  var workingIntervals = [];

  workingPlan = JSON.parse(workingPlan);
  customWorkingSlots = customWorkingSlots || [];

  calendar.fullCalendar('removeEvents', function(event) {
    return event.type == 'bgEvent' || event.customWorkingSlot == 1;
  });

  $.each(workingPlan, function() {
    var clinic = this.clinic;
    var color = this.color;

    if (selectedClinic != 'all' && clinic != selectedClinic) {
      return true;
    }

    $.each(this.workingPlan, function() {
      $.each(this, function(day, dayplan) {
        var dayOffset = dayplan.dow - viewStart.day();
        if (dayOffset < 0) {
          dayOffset += 7;
        }

        var dayDate = moment(viewStart).clone().add(dayOffset, 'days').startOf('day');

        if (viewName === 'agendaDay' && !dayDate.isSame(viewStart, 'day')) {
          return true;
        }

        if (dayDate.isBefore(viewStart, 'day') || dayDate.isSameOrAfter(viewEnd, 'day')) {
          return true;
        }

        var workingStart = buildDateTime(dayDate, dayplan.start);
        var workingEnd = buildDateTime(dayDate, dayplan.end);

        if (!workingStart || !workingEnd || !workingEnd.isAfter(workingStart)) {
          return true;
        }

        var blockedIntervals = [];
        $.each(dayplan.breaks || [], function() {
          var breakStart = buildDateTime(dayDate, this.start);
          var breakEnd = buildDateTime(dayDate, this.end);

          if (breakStart && breakEnd && breakEnd.isAfter(breakStart)) {
            blockedIntervals.push({
              start: breakStart,
              end: breakEnd
            });
          }
        });

        $.each(subtractIntervals({
          start: workingStart,
          end: workingEnd
        }, blockedIntervals), function() {
          workingIntervals.push({
            start: this.start,
            end: this.end,
            clinic: clinic,
            resourceId: clinic,
            color: color
          });
        });
      });
    });
  });

  $.each(customWorkingSlots, function() {
    if (selectedClinic != 'all' && this.clinic != selectedClinic) {
      return true;
    }

    var customStart = moment(this.start);
    var customEnd = moment(this.end);

    if (!customStart.isValid() || !customEnd.isValid() || !customEnd.isAfter(customStart)) {
      return true;
    }

    if (customEnd.isSameOrBefore(viewStart, 'day') || customStart.isSameOrAfter(viewEnd, 'day')) {
      return true;
    }

    workingIntervals.push({
      start: customStart,
      end: customEnd,
      clinic: this.clinic,
      resourceId: this.resourceId,
      color: getClinicColorFromWorkingPlan(this.resourceId, this.clinic)
    });
  });

  var mergedIntervals = mergeIntervalsByClinic(workingIntervals);
  var backgroundEvents = [];

  $.each(mergedIntervals, function(index) {
    backgroundEvents.push({
      id: 'not_working',
      className: 'fc-nonbusiness',
      start: this.start.clone(),
      end: this.end.clone(),
      rendering: 'inverse-background',
      type: 'bgEvent',
      clinic: this.clinic
    });

    backgroundEvents.push({
      id: 'working_' + index,
      start: this.start.clone(),
      end: this.end.clone(),
      rendering: 'background',
      type: 'bgEvent',
      color: this.color,
      clinic: this.clinic
    });
  });

  $.each(backgroundEvents, function() {
    calendar.fullCalendar('renderEvent', this, true);
  });
  
}


showLoadingScreen();

//$('[data-time]:not(.fc-minor)');

$(document).ready(function() {
  
  var screenWidth = $(window).width(); 
  var swipeThreshold =  screenWidth / 3  ;
  //window overflow settings for mobile device
  var container = $('.container');
  var viewName;
  updateScreen();

  $(window).resize(function() {
    screenWidth = $(window).width(); 
    swipeThreshold =  screenWidth / 3  ;
    updateScreen();
    
    
  });
  
  
  $(window).scroll(function() {
    
    var tableRect = $('.fc-view-container')[0].getBoundingClientRect();
    var header = $('.fc-head');
    var headerRect = header[0].getBoundingClientRect();
        
        // Check if the table is scrolled out of view
        if (tableRect.top < 0) {
          header.width(tableRect.width); // Match the width of the table
          header.addClass('fixed-header');
          header.css('transform', 'translateX(' + -scrollX + 'px)');
        } else {
          header.removeClass('fixed-header');
          header.width(tableRect.width);
          header.css('transform', 'translateX(' + 0 + 'px)');
          header.css('left',);
        }
        // Adjust header position when scrolling horizontally
        //
        
      });
     

  function updateScreen() {
    

    if (screenWidth < 800) {
      $('.fc-plus2w-button, .fc-plus3w-button, .fc-plus6w-button, .fc-plus1m-button,.fc-plus2m-button,.fc-plus3m-button,.navbar,.fc-toggleSidebarRight-button').hide();
    } else {
      
      $('.fc-plus2w-button, .fc-plus3w-button, .fc-plus6w-button, .fc-plus1m-button,.fc-plus2m-button,.fc-plus3m-button,.navbar,.fc-toggleSidebarRight-button').show();
    }
  }

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
  $('#customTimeslotsModal').appendTo("body");
  
  
  
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

    
    loadWorkingPlanBackgrounds();

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
        
        


        loadWorkingPlanBackgrounds();
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
     console.error('Error:', jqxhr.responseText);
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
			selectClinic = "<select id='clinicSelectEditApp' name='clinicSelectEditApp' class='clinicSelectEditApp form-control' style='width:250px'>";
			$.each(clinics, function() {
				selectClinic += "<option value='"+ this.clinic_id + "'>"+ this.clinic_name +"</option>";
			});
			selectClinic += "</select>";
			$('#editAppointment .selectClinic').html(selectClinic);
      $('#addWorkingSlot .selectClinic').html(selectClinic);
      $('#addWorkingSlot .clinicSelectEditApp').prepend('<option value="" selected>Select clinic</option>');
      $('#addWorkingSlot .addWorkingSlotSubmit').prop('disabled', true);
      
			
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
        loadWorkingPlanBackgrounds();	
      
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
      slotLabelInterval: '00:15:00',
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
          //googleCalendarId: 'nl.be#holiday@group.v.calendar.google.com'
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
            loadWorkingPlanBackgrounds();
          
          }
      },
        
      showCustomTimeslots: {
        text: 'Custom Workingplan',
        click: function() {
          $('#customTimeslotsModal').modal('show');
          renderCustomTimeslotsList();
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
        left: 'prev,next today plus2w,plus3w,plus6w plus1m,plus2m,plus3m refreshCalendar showCustomTimeslots',
        center: 'title',
        right: 'agendaDay,agendaWeek toggleSidebarRight'
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
					$('#editEvent .datetime').html(moment(start).locale(locale).format('LL'));
          $('#editEvent').appendTo("body").modal('show');
          $('#editEvent .appointmentStartTime').val(moment(start).format('HH:mm'));
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
              showRescheduleClinicServiceConfirm(selectedClinic, objEvent.serviceId).then(function(result){
                if(result.confirmed){
                  objEvent.clinic = selectedClinic;
                  objEvent.serviceId = result.serviceId;
                  updateAppointment();
                }
                
              });
            }else{updateAppointment();}
              
              
            
          } else if (clinicID != ''){
            clinic = clinicID;
            
            //clinicID = '';
            if(objEvent.clinic != clinicID ){
              showRescheduleClinicServiceConfirm(clinicID, objEvent.serviceId).then(function(result){
                if(result.confirmed){
                  objEvent.clinic = clinicID;
                  objEvent.serviceId = result.serviceId;
                  updateAppointment();
                }
                
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
        $('#editEvent .datetime').html(moment(start).locale(locale).format('LL'));
        $('#editEvent #addWorkingSlot .datetime').html(moment(start).locale(locale).format('LLL') + ' - ' +  moment(end).locale(locale).format('LT'));
        appModalMode = 'newAppointment';
        $('#editEvent').modal('show');
        $('#editEvent :input').val('');
        $('#editEvent .appointmentStartTime').val(moment(start).format('HH:mm'));
				$('#editEvent .confirmed').button("toggle");
				log('selected clinic is : ' + selectedClinic);
        //select the 30mins as defailt in busy time duration
        $('#busyTime .duration').prop("selectedIndex", 1).val(); 

				if (selectedClinic != 'all'){
          $('.clinicSelectEditApp').val(selectedClinic);
					renderServicesLookup(selectedClinic);
					$('#selectService').val(iDefaultService);
				} else if (selectedClinic == 'all') {
          //get the clinic id from the background event if it exists
          if (clinicID != '' || void(0)){
          log('the clinic id from BG is : ' + clinicID);
          $('.clinicSelectEditApp').val(clinicID);
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
        calSwipeDisabled = true;
        //log('start draggin!');
        oldEventStart = event.start;
        oldEventUsername = event.resourceName;
        
        


      },

      eventDrop: function(event, delta, revertFunc) {
      	calSwipeDisabled = false;
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
              showRescheduleClinicServiceConfirm(selectedClinic, objEvent.serviceId).then(function(result){
                if(result.confirmed){
                  objEvent.clinic = selectedClinic;
                  objEvent.serviceId = result.serviceId;
                  updateAppointment();
                }else{revertFunc();}
                
              });
            }else{updateAppointment();}
              
              
            
          } else if (clinicID != ''){
            clinic = clinicID;
        
            if(objEvent.clinic != clinicID ){
              showRescheduleClinicServiceConfirm(clinicID, objEvent.serviceId).then(function(result){
                if(result.confirmed){
                  objEvent.clinic = clinicID;
                  objEvent.serviceId = result.serviceId;
                  updateAppointment();
                }else{revertFunc();}
                
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
        icons += '<i class="fa fa-thumbs-up icon-thumbs-up-allocated tip-init" title="Allocated"></i>';
        icons += '<i class="fa fa-thumbs-up icon-thumbs-up-consultation tip-init" title="In Consultation"></i>';
        icons += '<i class="fa fa-thumbs-up icon-thumbs-up-post-consultation tip-init" title="Post Consultation"></i>';
        icons += '<i class="fas fa-comment icon-note title="note"></i>';
        //icons += '<i class="far fa-credit-card icon-payed" title="payed"></i>';       
        icons += '<i class="fas fa-cloud icon-cloud" title="cloud"></i></div>';       
        
        icon_payed = '<i class="far fa-credit-card icon-payed" title="payed"></i>';
        $(".fc-title", element).prepend(icon_payed);
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
            
            if (event.status == 0) {
              $(element).find('.icon-thumbs-up').hide();
            }

            if (event.status == 1) {
              $(element).find('.icon-thumbs-up').show();
              $(element).css({"border-left": "0.5em solid green","opacity":"1"});
            } else {
              $(element).find('.icon-thumbs-up').hide();
            }

            if (event.status == 2) {
              
              //$(element).addClass('appToBeMoved');
              rgba1 = hexToRGBA(event.backgroundColor,1);
              rgba2 = hexToRGBA(event.backgroundColor,0.5);
              $(element).css({"background": "repeating-linear-gradient(45deg,"+ rgba1 +","+ rgba1  +" 10px,"+rgba2+" 10px,"+rgba2+" 20px)","opacity":"1"});
              $(element).find('.fc-bg').css({"opacity":"0.6"});
            }

            if (event.status == 3) {
              $(element).find('.icon-thumbs-up-allocated').show();
              $(element).css('border-left','0.5em solid rgb(252, 137, 6)');
              
            } else {
              $(element).find('.icon-thumbs-up-allocated').hide();
            }

            if (event.status == 4) {
              $(element).find('.icon-thumbs-up-consultation').show();
              $(element).css('border-left','0.5em solid rgb(255, 84, 84)');
              $(element).css('background','red');
              $(element).addClass('pulsating-border');
              $(element).addClass('pulsating-background');

            } else {
              $(element).find('.icon-thumbs-up-consultation').hide();
            }

            if (event.status == 6) {
              $(element).find('.fc-title').addClass('appointmentCancelled');
            }


            if (event.status == 8) {
              $(element).find('.icon-thumbs-down').show();
            } else {
              $(element).find('.icon-thumbs-down').hide();
            }

            if (event.status == 5 || event.status == 9) {
              $(element).find('.icon-thumbs-up-post-consultation').show();
              $(element).css('border-left','0.5em solid rgb(244, 6, 252)');
            } else {
              $(element).find('.icon-thumbs-up-post-consultation').hide();
            }


            if (event.type != 'bgEvent'){ //bgEvent is used to display the working plan
              element.addClass('clinic' + event.clinic);
              element.addClass('appointment');
            }

            if (event.customAppointment == 1){
              element.addClass('customAppointment');
              element.removeClass('appointment');

            };

            if (event.payed == 1) {
              $(element).find('.icon-payed').show();
            } else {
              $(element).find('.icon-payed').hide();
            }

           
           
        

        
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
        viewName = view.name;
        
        if (viewName == 'agendaWeek') {renderCalendarTimes();}
        if (screenWidth < 800) {$('.container').css('width','800px');}
        else{
          //removeCalendarTimes();
        } 
        if (viewName == 'agendaDay') 
        {
          $('.container').css('width','100%');
          removeCalendarTimes();
        }
        loadWorkingPlanBackgrounds(view.start);
       

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
	 

  // Swipe gesture detection
  var touchStartX = 0;
  var touchEndX = 0;


  $('#calendar').on('touchstart', function(event) {
    touchStartX = event.originalEvent.touches[0].clientX;
  });

  $('#calendar').on('touchend', function(event) {
    touchEndX = event.originalEvent.changedTouches[0].clientX;
    handleSwipeGesture();
  });

  function handleSwipeGesture() {
  	if(calSwipeDisabled || viewName == 'agendaWeek'){return;}
    
    var swipeDistance = touchEndX - touchStartX;

    if (swipeDistance > swipeThreshold ) {
      $('.fc-prev-button').click();
    } else if (swipeDistance < -swipeThreshold) {
      $('.fc-next-button').click();
    }
  }
	
});

//outside document ready

function getClinicName(clinic_id){
  oClinic = clinics.find(x => x.clinic_id === clinic_id.toString());
  return oClinic.clinic_name;
}

function renderServicesLookup(clinic_id){
  try{  
  selectService = "<select id='selectService' name='selectService' class='serviceSelector form-control'>";
    
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

function getClinicServicesOptions(clinicId, selectedServiceId) {
  if (!clinics || !clinicId) {
    return { html: '', defaultServiceId: '' };
  }

  var clinic = clinics.find(function(item) {
    return item.clinic_id === clinicId.toString();
  });

  if (!clinic || !clinic.services) {
    return { html: '', defaultServiceId: '' };
  }

  var options = '';
  var defaultServiceId = '';
  $.each(clinic.services, function() {
    var isDefault = this.default == 1;
    if (isDefault && !defaultServiceId) {
      defaultServiceId = this.id;
    }
    var selected = selectedServiceId != null && this.id.toString() === selectedServiceId.toString() ? ' selected' : '';
    options += '<option value="' + this.id + '"' + selected + '>' + this.name + '</option>';
  });

  return {
    html: options,
    defaultServiceId: defaultServiceId || (clinic.services.length ? clinic.services[0].id : '')
  };
}

function getClinicServiceName(clinicId, serviceId) {
  if (!clinics || !clinicId || !serviceId) {
    return '';
  }

  var clinic = clinics.find(function(item) {
    return item.clinic_id === clinicId.toString();
  });

  if (!clinic || !clinic.services) {
    return '';
  }

  var service = clinic.services.find(function(item) {
    return item.id.toString() === serviceId.toString();
  });

  return service ? service.name : '';
}

function showRescheduleClinicServiceConfirm(clinicId, currentServiceId) {
  var deferred = $.Deferred();
  var services = getClinicServicesOptions(clinicId, currentServiceId);
  var clinicName = '';
  var currentClinicName = '';
  var currentServiceName = '';

  try {
    clinicName = getClinicName(clinicId);
  } catch (error) {
    clinicName = '';
  }

  try {
    currentClinicName = objEvent && objEvent.clinic ? getClinicName(objEvent.clinic) : '';
  } catch (error) {
    currentClinicName = '';
  }

  try {
    currentServiceName = objEvent && objEvent.clinic && objEvent.serviceId ? getClinicServiceName(objEvent.clinic, objEvent.serviceId) : '';
  } catch (error) {
    currentServiceName = '';
  }

  if (!services.html) {
    deferred.resolve({ confirmed: true, serviceId: currentServiceId });
    return deferred.promise();
  }

  var message = '' +
    '<div style="margin-bottom:10px;">Moving to different clinic - ' + (clinicName ? '<strong>' + clinicName + '</strong>' : 'the selected clinic') + '</div>' +
    '<div style="margin-bottom:10px;"><strong>Current:</strong> <strong>' + (currentClinicName || 'current clinic') + (currentServiceName ? ' / ' + currentServiceName : '') + '</strong></div>' +
    '<div class="form-group" style="margin-top:10px; text-align:left;">' +
      '<label class="control-label">select Clinic Service</label>' +
      '<select id="rescheduleClinicServiceSelect" class="form-control">' +
        services.html +
      '</select>' +
    '</div>';

  bootbox.dialog({
    title: 'Move appointment',
    message: message,
    className: 'moveAppointmentModal',
    onEscape: function() {
      deferred.resolve({ confirmed: false });
      return true;
    },
    buttons: {
      cancel: {
        label: 'No',
        className: 'btn-primary',
        callback: function() {
          deferred.resolve({ confirmed: false });
        }
      },
      confirm: {
        label: 'Yes',
        className: 'btn-primary',
        callback: function() {
          var selectedServiceId = $('#rescheduleClinicServiceSelect').val() || services.defaultServiceId;
          deferred.resolve({
            confirmed: true,
            serviceId: selectedServiceId
          });
        }
      }
    }
  });

  return deferred.promise();
}


  
