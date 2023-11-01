/*!

 =========================================================
 * Paper Bootstrap Wizard - v1.0.2
 =========================================================
 
 * Product Page: https://www.creative-tim.com/product/paper-bootstrap-wizard
 * Copyright 2017 Creative Tim (http://www.creative-tim.com)
 * Licensed under MIT (https://github.com/creativetimofficial/paper-bootstrap-wizard/blob/master/LICENSE.md)
 
 =========================================================
 
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 */

// Paper Bootstrap Wizard Functions


var searchVisible = 0;
var transparent = true;


var objPatient={};

var mode; //newPatient or recurrentPatient
var match = false;
var clinic; 
var clinics;
var practitioner;
var practitioner_to_propose;
var practitioners;
var patient;
var selected_timeslot;
var timing;
var group;
var calendar;
var socket = io('https://desk.timegenics.com');
var no_match_counter=0;
var service = new Object();
var monthsInAdvance = 12;
var practitionerNotAvailable;
var urlService;
var loadingImg = '<img class="loading" src="assets/img/rolling.svg">';
var wizard;



$(window).on('load',function() {
  // Animate loader off screen
  $(".se-pre-con").fadeOut("slow");;
});

$(document).ready(function() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  var html = '<div class="col-md-6 col-sm-12 col-xs-12"><div class="choice" data-toggle="wizard-radio"><input type="radio" name="clinic" value="%clinicID%" clinicName="%clinicName2%"><div class="card card-checkboxes card-hover-effect"><i class="ti-home"></i><p>%clinicName%</p></div></div></div>';
  var html_proposition="<div class='col-md-4 col-sm-12 col-xs-12'><div class='choice' data-toggle='wizard-radio'><input type='radio' name='proposition' value='%timeslot%'><div class='card card-checkboxes card-hover-effect'><i class='ti-calendar'></i><p>%timeslot_text%</p></div></div></div>";
  var html_no_proposition="<div class='col-md-4 col-sm-12 col-xs-12'><div class='choice'><input type='radio' name='proposition'><div class='card card-checkboxes'><i class='ti-calendar'></i><p>%text%</p></div></div></div>";
 
  

  if (urlParams.has('service')){ // patient is requesting a screening..limit months to book to 2
    monthsInAdvance = 2;
    practitionerNotAvailable = 3;
    urlService = urlParams.get('service');

  }
 

  
  function monthDiff(d1, d2) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
}

var today = new Date(); 
  
$("#loading").hide();
$("#timing").hide();
$('.urgent-footer').hide();



  //init cal
    calendar = new Calendar({
      id: "#calendar",
      calendarSize: "small",
      startWeekday:1,
      weekdayDisplayType: 'short',
      customWeekdayValues:[
        "Zo",
        "Ma",
        "Di",
        "Woe",
        "Dond",
        "Vrij",
        "Zat"
      ] ,
      customMonthValues:[
        "Januari",
        "Februari",
        "Maart",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Augustus",
        "September",
        "Oktober",
        "November",
        "December"
      ] ,
      
      
      
      headerBackgroundColor: '#7a9e9f',
      headerColor: '#7a9e9f',
      calendarSize: "large",
      theme: 'basic',
      //primaryColor:'#7a9e9f',
       monthChanged: (selectedDate, events) => {
              if(monthDiff(today, selectedDate) == 0){
                leftArrow = document.getElementsByClassName('calendar__arrow-prev')[0];        
                leftArrow.style.display = "none";
              } else {
                leftArrow = document.getElementsByClassName('calendar__arrow-prev')[0];        
                leftArrow.style.display = "block";                
              }
              if(monthDiff(today, selectedDate) == monthsInAdvance){
                rightArrow = document.getElementsByClassName('calendar__arrow-next')[0];        
                rightArrow.style.display = "none";
              } else {
                rightArrow = document.getElementsByClassName('calendar__arrow-next')[0];        
                rightArrow.style.display = "block";                
              }
          }, 
      
      dateChanged: (currentDate, propositions) => {
        let doWeHavePropositions = false;
        $('#timeslot_select .propositions').html('');
        //const events_display = document.querySelector('.events-display');
        let events_html = '';
       
        propositions.forEach(proposition => {
          doWeHavePropositions = true;
          value = {user:proposition.user,clinic:proposition.clinic,start:proposition.start,end:proposition.end};
          value = JSON.stringify(value);
          newhtml = html_proposition.replace('%timeslot%',value);
          newhtml = newhtml.replace('%timeslot_text%', moment(proposition.start).locale('nl-be').format('LT'));
          $('#timeslot_select .propositions').append(newhtml);
        
        });
        if(doWeHavePropositions) {
          $('#message_propositions').html('');
         
        } else {
          newhtml =  html_no_proposition.replace('%text%','Geen mogelijkheden voor deze dag');
          $('#timeslot_select .propositions').append(newhtml);

        
        }
        
      },
      selectedDateClicked:(currentDate) =>{
        
      }

    

                      
      
      
    });

    $('#calendar').click(function(){

     let theDate = calendar.getSelectedDate();
     calendar.setDate(theDate);
     
    });
 
 
  
   // get the clinics from group
   $.ajax({
  		dataType: "json",
		url: apiURL,
  		data: { 
  			task: 'getClinicsFromGroup', 
  			group : getGroup}
		}).done(function( data ) {
      clinics = data;
      $.each(clinics, function() {
        newhtml = html.replace('%clinicID%',this.clinic_id);
        newhtml = newhtml.replace('%clinicName%',this.clinic_name);
        newhtml = newhtml.replace('%clinicName2%',this.clinic_name);
        $('#location .clinics').append(newhtml);
        
        //set the group /
        group = {ID:this.group_id,email:this.admin_email,name:this.groupname, logo:this.logo, description:this.description,allow_np_online_booking:parseInt(this.allow_np_online_booking), allow_urgent_request:parseInt(this.allow_urgent_request),practitioner_title:this.practitioner_title};
      });
      group.logo = '<img src = '+group.logo+'>';
      console.log('read this.. ' + group.description);
      $('.group-description').html(group.logo + group.description);
      //if allow_np_online_booking = false skip the first wizard slide, patient can only book if they are already in the system
      if(!group.allow_np_online_booking){
        mode = 'recurrentPatient';
        $('#selectRecurrentNewPatient').hide();
        $('#recurrentPatient').show();
        $('.btn-next').show();
      }
      $('.practitioner_title').html(group.practitioner_title);
  	
    });  
  
   
  

  /*  Activate the tooltips      */
  $('[rel="tooltip"]').tooltip();

  // Code for the Validator

  var $validatorUrgent = $('#urgent form').validate({
    rules:{
      urgent_practitioner:{
                required:true
          },
      severity:{
          required:true
      },
      note:{
          required:true
      }
    },
    messages:{
      urgent_practitioner:'Kies een chiropractor of geen voorkeur',
      severity:'Geef aan hoe lang je reeds problemen hebt',
      note:'Geef een korte uitleg of jouw probleem.'

    },
    errorPlacement: function(error, element) {
          $('#urgent #message').html(error);
          
    }
    
    
    }); 

   var $validatorTimeslot = $('#timeslot_select form').validate({
      rules:{
            proposition:{
                  required:true
            }
      },
      messages:{
            proposition:'Selecteer een tijdstip'
      },
      errorPlacement: function(error, element) {
            $('#timeslot_select #message').html(error);
            
      }
      
      
      });
  var $validatorConditions = $('#conditions form').validate({
    rules:{
          condition:{
                required:true
          }
    },
    messages:{
          condition:'U moet akkoord gaan met deze voorwaarde om uw afspraak te maken.'
    },
    errorPlacement: function(error, element) {
          $('#conditions #message').html(error);
          
    }
    
    
    });
  
  var $validatorPractitioner = $('#practitioner form').validate({
      rules:{
            practitioner:{
                  required:true
            }
      },
      messages:{
            practitioner:'Selecteer een chiropractor'
      },
      errorPlacement: function(error, element) {
            $('#practitioner #message').html(error);
            
      }
      
      
      });
  
  var $validatorClinic = $('#location form').validate({
      rules:{
            clinic:{
                  required:true
            }
      },
      messages:{
            clinic:'Selecteer een locatie'
      },
      errorPlacement: function(error, element) {
            $('#location #message').html(error);
            
      }
      
      
      });
  
  var $validatorNewPatient = $('#newPatient form').validate({
      rules: {
      firstName: {
        required: true,
        minlength: 3
      },
      surName: {
        required: true,
        minlength: 3
      },
      DOB: {
        beDate: true,

      },
      email: {
        required: true,
        email: true
      },
      phone:{
         required:true,
      }
    },
    messages: {
      firstName:"vul je voornaam in",
      surName:"vul je achternaam in",
      email: "ongeldig email formaat: vb. tom@domain.com",
      DOB: "ongeldig formaat: vb. 21/03/1995",
      phone: "gelieve je telefoonnummer in te geven"

    }
      
      
      });
  
  
  var $validator = $('#recurrentPatient form').validate({
    rules: {
      firstName: {
        required: true,
        minlength: 3
      },
      surName: {
        required: true,
        minlength: 3
      },
      DOB: {
        beDate: true,

      },
      email: {
        required: true,
        email: true,
      }
    },
    messages: {
      firstName:"vul je voornaam in",
      surName:"vul je achternaam in",
      email: "ongeldig email formaat: vb. tom@domain.com",
      DOB: "ongeldig formaat: vb. 21/03/1995"

    }
  });

  $('#recurrentPatient form input').on('keyup', function() {
   
    
  });



  $.validator.addMethod("beDate",
    function(value, element) {
      return value.match(/^(0?[1-9]|[12][0-9]|3[0-1])[/., -](0?[1-9]|1[0-2])[/., -](19|20)?\d{2}$/);
    },
    "Please enter a date in the format!"
  );


  // Wizard Initialization
    wizard = $('.wizard-card').bootstrapWizard({
    'tabClass': 'nav nav-pills',
    'nextSelector': '.btn-next',
    'previousSelector': '.btn-previous',
    onPrevious: function (tab, navigation,index){
      
      switch (index) {
        case 2: // previous was clicked on select timeslot 
          $('#' + practitioner.ID).click();
          
        break;
      }
    },

    onNext: function(tab, navigation, index) {
      //var $current = index + 1;
      

      switch (index) {
        case 1: //next was clicked on first slide of wizard
          
          switch (mode) {
            case 'recurrentPatient':
              var $valid = $('#recurrentPatient form').valid();
              if (!$valid) {
                $validator.focusInvalid();
                return false; //do not navigate to next slide
              } else { //form is valid, check with DB for patient match
                  if(match === false){
                        checkMatch();
                        return false;
                  } else {
                    //suggest clinic
                    
                    //$('.clinics :input[value='+ objPatient.clinic +']').click();
                  }


            

              }
              break;

            case 'newPatient':
              var $valid = $('#newPatient form').valid();
              if (!$valid) {
                $validatorNewPatient.focusInvalid();
                return false; //do not navigate to next slide
              } else { //form is valid,  will only save to DB if app is confirmed
                  form = $('#newPatient form').serializeArray();
                  
                  objPatient.firstname = form[0].value;
                  objPatient.surname = form[1].value;
                  // the following 2 lines are needed because table_patients has patient_firstname and patients_surname as fields... 
                  objPatient.patient_firstname = form[0].value;
                  objPatient.patient_surname = form[1].value;
                  
                  objPatient.dob = moment(form[2].value, 'DD-MM-YYYY').format('YYYY-MM-DD');
                  objPatient.email = form[3].value;
                  objPatient.phone = form[4].value;
                  objPatient.id=
                  
                  //send NP details by mail... 
                  $.get(apiURL,{task:'emailTempNP',patient:JSON.stringify(objPatient)});

              }
            break;
          }

          break;
          
          case 2: //next was clicked on the select location wizard
            var $valid = $('#location form').valid();
              if (!$valid) {
                //$validator.focusInvalid();
                return false; //do not navigate to next slide
              } else {
               var clinic_id = $("input:radio[name ='clinic']:checked").val();
               var clinic_name = $("input:radio[name ='clinic']:checked").attr('clinicName');
               //set clinic name on the wizard

               clinic = {ID:clinic_id,name:clinic_name};
               
               
               $('.group-description').html(group.logo + clinic.name);
               //set the service title
               
               
               //if recurrent patient-> propose the practitioner
               if (mode == 'recurrentPatient'){
                $('#practitioner #message').html('Selectie gemaakt op basis van je laatste bezoek.');
                $('#' + practitioner_to_propose).click();
               } 
               
              
              }
              
          break;
      
          case 3://next was clicked on the select practitioner wizard
          
          
            var $valid = $('#practitioner form').valid();
              if (!$valid) {
                //$validator.focusInvalid();
                return false; //do not navigate to next slide
              }else{

               practitioner = new Object();
               practitioner.ID =  $("input:radio[name ='practitioner']:checked").val();
               practitioner.name = $("input:radio[name ='practitioner']:checked").attr('practitionerName');
               
              if (group.ID == '1'){
               $.get( apiURL, { task: "push", title: objPatient.patient_surname + ' ' + objPatient.patient_firstname + '(' + objPatient.patient_id + ')' , body: 'finding timeslot with: ' + practitioner.name } );
              }
               $.each(practitioners, function() {
                if (this.ID == practitioner.ID){
                practitioner=this;
                
                }
              
                

              });
               
               //$(".group-description").html(clinic.name + " / " + practitioner.name);
               $('.wizard-title').html('Afspraak maken bij ' + practitioner.display_name);
               //check the service we need 
               

               if (urlParams.has('service')==true){
                  if (mode == 'recurrentPatient'){
                    if(urlService == 'rugscreening_30'){
                      urlService = 'rugscreening_15'
                    }
                  }
                  service = practitioner.services.find(x => x.name === urlService);
                  console.log(service.id + ' : Service_id');
			      $('.service-title').html(service.description);
               } else {
                 switch (mode)
                  {              
                    case 'recurrentPatient':
                      service.id = practitioner.default_service.service;
                      service.duration = practitioner.default_service.duration;
                      service.description = practitioner.default_service.description

                    break;
                    case 'newPatient':
                      service.id = practitioner.default_service_np.service;
                      service.duration = practitioner.default_service_np.duration;
                      service.description = practitioner.default_service_np.description
                    break;
                  }
				        $('.service-title').html(service.description);
               }    
               getAvailableTimes(service.id,service.duration,timing);
              }
          break;
         
          case 4: // next was clicked on the select timeslot tab
               $('.error').html('');
               if (group.ID == '1'){
                $.get( apiURL, { task: "push", title: objPatient.patient_surname + ' ' + objPatient.patient_firstname + '(' + objPatient.patient_id + ')' , body: 'waiting to confirm appt..' } );
               }
               var $valid = $('#timeslot_select form').valid();
                  if (!$valid) {
                     return false; //do not navigate to next slide
                  }else{
                     selected_timeslot = $("input:radio[name ='proposition']:checked").val();
                     selected_timeslot = JSON.parse (selected_timeslot);
                     //alert(selected_timeslot);
                     
                     $('#resume .patient').html(objPatient.patient_surname + ' ' +objPatient.patient_firstname);
                     $('#resume .practitioner').html(practitioner.display_name);
                     $('#resume .service').html(service.description);
                     $('#resume .location').html(clinic.name);
                     $('#resume .timeslot').html(moment(selected_timeslot.start).locale('nl-be').format('LLLL'));
                     
                  }
               
          break;

          case 5: //next was clicked on conditions tab
            /* $('.error').html('');
            var $valid = $('#conditions form').valid();
            if (!$valid) {
              return false; //do not navigate to next slide
            }else{
              //navigate to nxt slide
            }
                 */
          break;
      }



    },

    onInit: function(tab, navigation, index) {

      //check number of tabs and fill the entire row
      var $total = navigation.find('li').length;
      $width = 100 / $total;

      navigation.find('li').css('width', $width + '%');

    },

    onTabClick: function(tab, navigation, index) {


      var $valid = $('.wizard-card form').valid();
      return false;
      if (!$valid) {
        return false;
      } else {
        return true;
      }

    },

    onTabShow: function(tab, navigation, index) {
      if (index == 1){match = false;}
      var $total = navigation.find('li').length;
      var $current = index + 1;

      

      var $wizard = navigation.closest('.wizard-card');

      // If it's the last tab then hide the last button and show the finish instead
      if ($current >= $total) {
        $($wizard).find('.btn-next').hide();
        $($wizard).find('.btn-finish').show();
      } else {
        $($wizard).find('.btn-next').show();
        $($wizard).find('.btn-finish').hide();
      }

      //update progress
      var move_distance = 100 / $total;
      move_distance = move_distance * (index) + move_distance / 2;

      $wizard.find($('.progress-bar')).css({
        width: move_distance + '%'
      });
      //e.relatedTarget // previous tab

      $wizard.find($('.wizard-card .nav-pills li.active a .icon-circle')).addClass('checked');

    }
  });
  
  
  $('.btn-urgent-finish').click(function(){

    //check if form valid
    var $valid = $('#urgent form').valid();
    if (!$valid) {
      $validator.focusInvalid();
      return false; //do nothing
    } else {
      $('.wizard-card').bootstrapWizard('show',4);
      $('#resume .loading').html(loadingImg).show();
      $('#resume_details').hide();
      $('#urgent').hide();
      $('.btn-urgent-finish-saving').show();
      $('.btn-urgent-finish').hide();

      //get the right service
      switch (mode) 
      {
        case 'recurrentPatient':
          service.id = practitioner.default_service_urgent.service;
          service.duration = practitioner.default_service_urgent.duration;
          service.description = practitioner.default_service_urgent.description

        break;
        case 'newPatient':
          service.id = practitioner.default_service_np_urgent.service;
          service.duration = practitioner.default_service_np_urgent.duration;
          service.description = practitioner.default_service_np_urgent.description
        break;
      }

      //construct the demand for urgent appointment

      userID = $("input:radio[name ='urgent_practitioner']:checked").val();  //is 0 if no specific practitioner

      var demand = {
        userID: userID,
        patient:objPatient,
        clinic:clinic.ID,
        group:group.ID,
        severity:$("input:radio[name ='severity']:checked").val(), 
        note:$('.urgent_note').val(),
        service:service.id
      }

      $.ajax({
          
        url: apiURL,
        dataType: "json",
        data: {
          task: 'addToWaitinglist',
          demand:JSON.stringify(demand)
          
        },
        
        }).done(function(data) {
          
          $('#urgent_confirmation .patient').html(objPatient.patient_surname + ' ' +objPatient.patient_firstname);
          if (userID=='0'){
            $('#urgent_confirmation .practitioner').html('geen voorkeur');
          }else{
            $('#urgent_confirmation .practitioner').html(practitioner.display_name);
          }
          $('#urgent_confirmation .service').html(service.description);
          $('#urgent_confirmation .location').html(clinic.name);
          $('#urgent_confirmation .note').html($('.urgent_note').val());
          
          //$('.wizard-card').bootstrapWizard('show',4);
         
          $('#resume .loading').hide();
          $('#urgent_confirmation').show();
          $('#urgent').hide();
          //$('.btn-urgent-finish-saving').hide();
          $('.urgent-footer').hide();
          
          
        }).fail(function(){
          $('.wizard-card').bootstrapWizard('show',3);
          $('#urgent #message').html('Oops!!! Bevestigen mislukt!! Probeer opnieuw aub.');
          $('.btn-urgent-finish-saving').hide();
          $('.btn-urgent-finish').show();
          $('#resume .loading').hide();
          $('#urgent').show();

        });
    }

  });
  
  $('.btn-finish').click(function(){
   $('.btn-finish-saving').show();
   $('.btn-finish').hide();
   
   //construct the appointment

   switch (mode)
   {
     case 'recurrentPatient':

       var appointment  = {userID:practitioner.ID,clinic:clinic.ID,patientID:objPatient.patient_id,madeOnline:1,start:selected_timeslot.start,end:selected_timeslot.end,service:service.id,status:0,group:group.ID};
       appointment = JSON.stringify(appointment);
       addAppointment(appointment);
       console.log(appointment);
       


     break;
     case 'newPatient':
     

      //create the new patient in DB
      objPatient.group = group.ID;
      objPatient.clinic = clinic.ID;
      objPatient.practitioner = practitioner.ID;

      $.ajax({
         
        url: apiURL,
        dataType: "json",
        data: {
           task: 'addNewPatient',
           patient:JSON.stringify(objPatient)
           
        },
        
        }).done(function(data) {
          objPatient.patient_id = data;

          var appointment  = {userID:practitioner.ID,clinic:clinic.ID,patientID:objPatient.patient_id,madeOnline:1,start:selected_timeslot.start,end:selected_timeslot.end,service:service.id,status:0,group:group.ID}
          appointment = JSON.stringify(appointment);


         
          addAppointment(appointment);
           
        }).fail(function(){
           $('#resume #message').html('Oops!!! Bevestigen mislukt!! Probeer opnieuw aub.');
           $('.btn-finish-saving').hide();
           $('.btn-finish').show();
        });
     break;
   }
   
   
   
   
   
  
  });

  
  function addAppointment(appointment){
    $('#resume .loading').html(loadingImg).show();
    $('#resume .loading').prop('disabled', true);
    $('.btn-next').prop('disabled', true);
    $('#resume_details').hide();
    $.ajax({
         
      url: apiURL,
      dataType: "json",
      data: {
         task: 'addAppointment',
         appointment:appointment,
         email:group.email
         
         //comment:$('#timing #comment').val()
      },
      
      }).done(function() {
         $('.btn-next').prop('disabled', false);
         $('#resume .loading').hide();
         $('.btn-finish-saving').hide();
         $('.btn-previous').hide();
         $('#resume_details').hide();
         $('#resume .loading').prop('disabled', false);
         $('#confirmed').show();
         $('.btn-restart').show();
         //$('.btn-finish').show();
         //show the confirmation page
         socket.emit('calendar_changed');
         
      }).fail(function(data){
         $('#resume .loading').hide();
         $('.btn-next').prop('disabled', false);
         $('#resume .loading').prop('disabled', false);
         $('#resume_details').show();
         $('#resume #message').html('Oops!!! Bevestigen mislukt!! Probeer opnieuw aub.');
         $('.btn-finish-saving').hide();
         $('.btn-finish').show();
      });

  }
 
  
  
  // Prepare the preview for profile picture
  $("#wizard-picture").change(function() {
    readURL(this);
  });

  $('.clinics').on('click','[data-toggle="wizard-radio"]',function() {
      
    wizard = $(this).closest('.toggle');
    wizard.find('[data-toggle="wizard-radio"]').removeClass('active');
    $(this).addClass('active');
    $(wizard).find('[type="radio"]').removeAttr('checked');
    $(this).find('[type="radio"]').attr('checked', 'true');
    
    //as soon as a clinic is selected.. get the practitioners and pre-load them into next slide
    $('#practitioner .practitioners').html('');
    getPractitionersFromClinic($("input:radio[name ='clinic']:checked").val());
    
  });
  
  $('.practitioners').on('click','[data-toggle="wizard-radio"]',function() {
      
    wizard = $(this).closest('.toggle');
    wizard.find('[data-toggle="wizard-radio"]').removeClass('active');
    $(this).addClass('active');
    $(wizard).find('[type="radio"]').removeAttr('checked');
    $(this).find('[type="radio"]').attr('checked', 'true');    
    
  });


  $('.urgent_practitioner_select,.severity').on('click','[data-toggle="wizard-radio"]',function() {
      
    wizard = $(this).closest('.toggle');
    wizard.find('[data-toggle="wizard-radio"]').removeClass('active');
    $(this).addClass('active');
    $(wizard).find('[type="radio"]').removeAttr('checked');
    $(this).find('[type="radio"]').attr('checked', 'true');    
    
  });





  $('.btn-restart').click(function(){
    location.reload();
  });

  $('.btn-done').click(function(){
    $.each(clinics, function() {
      if (this.clinic_id == clinic.ID){
        location.href = this.clinic_url;
       }
     });
  });
  
  
  $('.propositions').on('click','[data-toggle="wizard-radio"]',function() {
      
    wizard = $(this).closest('.wizard-card');
    wizard.find('[data-toggle="wizard-radio"]').removeClass('active');
    $(this).addClass('active');
    $(wizard).find('[type="radio"]').removeAttr('checked');
    $(this).find('[type="radio"]').attr('checked', 'true');    
    
  });
  

  $('[data-toggle="wizard-checkbox"]').click(function() {
    if ($(this).hasClass('active')) {
      $(this).removeClass('active red');
      $(this).find('[type="checkbox"]').removeAttr('checked');
    } else {
      $(this).addClass('active red');
      $(this).find('[type="checkbox"]').attr('checked', 'true');
    }
  });

  $('.set-full-height').css('height', 'auto');


  //____//
  
  $('.btn-next').hide();
  $('.btn-finish-saving').hide();
  $('.btn-urgent-finish-saving').hide();
  $('.btn-restart').hide();

  $('.recurrent').click(function() {
    mode = 'recurrentPatient';
    $('#selectRecurrentNewPatient').hide();
    $('#recurrentPatient').show();
    $('.btn-next').show();
  });
  $('.new').click(function() {
    mode = 'newPatient';
    $('#newPatient').show();
    $('#selectRecurrentNewPatient').hide();
    $('.btn-next').show();
  });
  $(document).on("click", ".btn_error_match" , function() {
    console.log('starting');
    $('#message').html('Bezig...');
    $.ajax({
      
      url: apiURL,
      data: {
        task: 'error_match',
        email: group.email,
        clinic:clinics[0].clinic_id, 
        patient : JSON.stringify(patient)
      }
    }).done(function() {
      console.log('error reported...');
      $('#message').html('Het secretariaat heeft een melding gekregen. Je kan ondertussen altijd per telefoon of whatsapp contacteren.');
      

   
   }).fail(function( jqXHR, textStatus ) {
      alert( "Request failed: " + textStatus );
   });
  });
  
$(document).on("click", ".keep_old_email" , function() {
  //ok nothing needs to be updated and move to next slide
  console.log('no_updating');
  $('#confirmEmail').modal('hide');
  wizard.bootstrapWizard('next');

});

$(document).on("click", ".update_email" , function() {
  //update 
  
  $.ajax({
    url: apiURL,
    data: {
      task: 'update_patient_field',
      patient_id: objPatient.patient_id,
      field: 'email',
      value: objPatient.new_email
    }
  }).done(function() {
    
    $('#email').val(objPatient.new_email);
    $('#confirmEmail').modal('hide');
    wizard.bootstrapWizard('next');
   
 }).fail(function( jqXHR, textStatus ) {
    alert( "Request failed: " + textStatus );
 });
  
});


$(document).on("click",".btn_OpenUrgentApptWarningModal",function(){
  $('#urgentApptWarning').modal('show');
});


$(document).on("click", ".btn_urgent" , function() {
  if (group.ID == '1'){
    $.get( apiURL, { task: "push", title: objPatient.patient_surname + ' ' + objPatient.patient_firstname + '(' + objPatient.patient_id + ')' , body: 'Started the urgent appointment request ' + practitioner.name } );
  }
  $('#urgentApptWarning').modal('hide');
    $('#timeslot_propositions').hide();
    $('#urgent').show();
    $('.standard-footer').hide();
    $('.urgent-footer').show();
    $('.urgent_practitioner_input').val(practitioner.ID);
    $('.urgent_practitioner').html(practitioner.display_name);
    $('.urgent_clinic').html(clinic.name);
    //swap the icon and text of the tab
    $('#tab4 i').toggleClass('ti-bolt');
    $('#tab4 i').toggleClass('ti-calendar');
    $('#tab4 .tabTitle').html('Urgentie');
    $('.service-title').html('Dringende consultatie').toggleClass('urgent');




});

$(document).on("click", ".btn-urgent-previous" , function() {
  $('#timeslot_propositions').show();
  $('#urgent').hide();
  $('.standard-footer').show();
  $('.urgent-footer').hide();
   //swap the icon and text of the tab
   $('#tab4 i').toggleClass('ti-bolt');
   $('#tab4 i').toggleClass('ti-calendar');
   $('#tab4 .tabTitle').html('Tijdstip');
   $('.service-title').html(service.description).toggleClass('urgent');
});




function getAvailableTimes(service,duration,timing){
   //clear the propositions if there would be any...
   $('#loading').html(loadingImg).show();
   $('.btn-next').prop('disabled', true);
   $('#calendar').hide();
   $('.btn_OpenUrgentApptWarningModal').hide();
   $('#message_propositions').hide();
   $('#timeslot_select .propositions').html('');
   console.log('SERVICE !!! ' + service);

   //practitioner = practitioners.find(x => x.ID === parseInt(practitioner.ID));
   
  
   $.ajax({
                  dataType: "json",
                  url: apiURL,
                  data: {
                    task: 'getAvailableTimes',
                    clinic: clinic.ID,
                    user : practitioner.ID,
                    duration:duration,
                    service: service,
                    timing : JSON.stringify(timing)
                  }
                }).done(function(propositions) {
                $('.btn-next').prop('disabled', false);  
                $('#timeslot_select .propositions').html('');
                $('#loading').hide();
                $('.btn_OpenUrgentApptWarningModal').show();
                $('#calendar').show();
                calendar.setEventsData(propositions);   
                if(!group.allow_urgent_request){
                  $('.btn_OpenUrgentApptWarningModal').hide();
                }
               }).fail(function( jqXHR, textStatus ) {
                  alert( "Request failed: " + textStatus );
               });
}


function checkMatch() {
  
                form = $('#recurrentPatient form').serializeArray();
                //save the data to the server
                var firstname = form[0].value;
                var surname = form[1].value;
                var dob = form[2].value = moment(form[2].value, 'DD-MM-YYYY').format('YYYY-MM-DD');
                var email = form[3].value;
                patient = {
                  surname: surname,
                  firstname: firstname,
                  dob: dob,
                  email: email,
                  group:group.ID
                };
                $.ajax({
                  dataType: "json",
                  url: apiURL,
                  data: {
                    task: 'findPatientMatch',
                    patient: JSON.stringify(patient)
                  }
                }).done(function(patient) {
                  if (patient.match === true) {
                    objPatient = patient;
                    //move to select location
                    match = true;
                    //suggest practitioner to patient 
                    if(patient.last_encounter == 0){
                      //propose patient.practitioner
                      practitioner_to_propose = patient.practitioner;
                    } else{
                      if (patient.last_encounter != patient.practitioner) {
                        //propose patient.last_encounter
                        practitioner_to_propose = patient.last_encounter;
                      } else {
                        //propose patient.practitioner
                        practitioner_to_propose= patient.practitioner;
                      }
                    }
                    $('#location .info-text').html('Waar wens je een afspraak ' + patient.patient_firstname + '?');
                    //email given in form might be different than the one we have in DB .. so ask which one is the correct one...
                    if(objPatient.hasOwnProperty('new_email')== true){
                      //show confirm email modal
                      $('#confirmEmail .keep_old_email').html(objPatient.email);
                      $('#confirmEmail .update_email').html(objPatient.new_email);
                      $('#confirmEmail').modal('show');
                    } else {
                    wizard.bootstrapWizard('next');
                    }
                  } else {
					
					if (++no_match_counter<2){                  	
                    	$('#message').html('We vinden geen gegevens van u...probeer gerust opnieuw.');
                    } else {
                    	$('#message').html('We vinden geen gegevens. Misschien is er een fout in de gegevens die we van jou hebben. Klik op de knop hieronder zodat we de fout kunnen bekijken. Je hoort dan snel van ons.<p><button class="btn_error_match">Verstuur</button></p>');
                    }
                    
                    
                  }
                });
      }

      function createNewPatient(){
            form = $('#newPatient form').serializeArray();
                //save the data to the server
        
                
                var surname = form[3].value;
                var firstname = form[0].value;
                var dob = form[1].value = moment(form[1].value, 'DD-MM-YYYY').format('YYYY-MM-DD');
                var email = form[4].value;
                var phone = form[2].value;
                var patient = {
                  surname: surname,
                  firstname: firstname,
                  group:group.ID,
                  dob: dob,
                  email: email,
                  phone:phone,
                  practitioner:1,
                  clinic:1
                };
                
                objPatient = patient;
               //make the patient id DB
              
               $.ajax({
                url: apiURL,
                //dataType: "json",
               
                data: {
                  task: 'addNewPatient',
                  patient:JSON.stringify(patient)
          
                },
                success: function(data) {
                  
                      //callback(patientID);
              
                }
              });

            
      }
      
      
      
      function getPractitionersFromClinic(clinic){
            $('#practitioner .practitioners').html(loadingImg);
            var html='<div class="col-sm-12 col-xs-12 col-md-4"><div id="%practitionerID%" class="choice" data-toggle="wizard-radio"><input type="radio" name="practitioner" value="%practitionerID%" practitionerName="%practitionerName2%"><div class="card card-checkboxes card-hover-effect"><i class="ti-user"></i><p>%practitionerName%</p></div></div></div>';
            $.ajax({
                  dataType: "json",
                  url: apiURL,
                  data: {
                    task: 'getPractitionersFromClinic',
                    clinic: clinic
                  }
                }).done(function(data) {
        
                  practitioners = data;
                  
                  
                  $('#practitioner .practitioners').html('');
                   $.each(practitioners, function() {
                        
                          if (this.ID == practitionerNotAvailable && mode != 'recurrentPatient'){
                            return true;
                          }
                          newhtml = html.replaceAll('%practitionerID%',this.ID);
                          newhtml = newhtml.replace('%practitionerName%',this.display_name);
                          newhtml = newhtml.replace('%practitionerName2%',this.display_name);
                         
                          
                        $('#practitioner .practitioners').append(newhtml);
                        
                         
                   });
                  
                  
                  
                  
                  
            });
      }
      
function getGroup() {
    var params = {};

    if (location.search) {
      var parts = location.search.substring(1).split('&');

      for (var i = 0; i < parts.length; i++) {
        var nv = parts[i].split('=');
        if (!nv[0]) continue;
        params[nv[0]] = nv[1] || true;
      }
    }
    //console.log('this is the group=' + params.group);
    return params.group;
  }

  function getService() {
    var params = {};

    if (location.search) {
      var parts = location.search.substring(1).split('&');

      for (var i = 0; i < parts.length; i++) {
        var nv = parts[i].split('=');
        if (!nv[0]) continue;
        params[nv[0]] = nv[1] || true;
      }
    }
    //error.log('this is the group=' + params.group);
    return params.service;
  }


});




//Function to show image before upload

function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function(e) {
      $('#wizardPicturePreview').attr('src', e.target.result).fadeIn('slow');
    };
    reader.readAsDataURL(input.files[0]);
  }
}
