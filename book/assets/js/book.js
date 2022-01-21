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
var selected_timeslot;
var timing;
var group;
var calendar;

var loadingImg = '<img class="loading" src="assets/img/rolling.svg">';

var apiURL = "https://www.timegenics.com/app/api.php";

$(document).ready(function() {
   
$("#loading").hide();
$("#timing").hide();


  //init cal
    calendar = new Calendar({
      id: "#calendar",
      calendarSize: "small",
      headerBackgroundColor: '#7a9e9f',
      headerColor: '#7a9e9f',
      calendarSize: "large",
      theme: 'basic',
      //primaryColor:'#7a9e9f',
      monthChanged:() => {},

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
          newhtml = newhtml.replace('%timeslot_text%',moment(proposition.start).locale('nl-be').format('LT'));
          $('#timeslot_select .propositions').append(newhtml);
        
        });
        if(doWeHavePropositions) {
          $('#message_propositions').html('');
         
        } else {
          $('#message_propositions').show();
          $('#message_propositions').html('Geen mogelijkheden voor deze dag...');
        
        }
        
      },
      selectedDateClicked:(currentDate) =>{
        
      }

    

                      
      
      
    });

    $('#calendar').click(function(){

     let theDate = calendar.getSelectedDate();
     calendar.setDate(theDate);
     
    });
 
   var html = '<div class="col-md-6 col-sm-12 col-xs-12"><div class="choice" data-toggle="wizard-radio"><input type="radio" name="clinic" value="%clinicID%" clinicName="%clinicName2%"><div class="card card-checkboxes card-hover-effect"><i class="ti-home"></i><p>%clinicName%</p></div></div></div>';
   var html_proposition="<div class='col-md-4 col-sm-12 col-xs-12'><div class='choice' data-toggle='wizard-radio'><input type='radio' name='proposition' value='%timeslot%'><div class='card card-checkboxes card-hover-effect'><i class='ti-calendar'></i><p>%timeslot_text%</p></div></div></div>";
   
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
        //set the group 
        group = {ID:this.group_id, name:this.groupname, logo:this.logo, description:this.description};
      });
      let logo = '<img src = '+group.logo+'>';
      $('.group-description').html(logo + group.description);
   
  		
    });  
  
   
  

  /*  Activate the tooltips      */
  $('[rel="tooltip"]').tooltip();

  // Code for the Validator
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
        email: true,
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
      phone: "gelieve uw telefoonnummer in te geven"

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
  var wizard = $('.wizard-card').bootstrapWizard({
    'tabClass': 'nav nav-pills',
    'nextSelector': '.btn-next',
    'previousSelector': '.btn-previous',

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
               
               let logo = '<img src = '+group.logo+'>';
               $('.group-description').html(logo + clinic.name);
               //propose the practitioner
               $('#practitioner #message').html('Selectie gemaakt op basis van uw laatste bezoek.');
               $('.practitioners :input[value='+ practitioner_to_propose +']').click();
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
               
               //$(".group-description").html(clinic.name + " / " + practitioner.name);
               $('.wizard-title').html($('.wizard-title').html() + ' bij ' + practitioner.name);
               getAvailableTimes(timing);
              }
          break;
         
          case 10: //next was clicked on the timing wizard
               timing = $("input:checkbox[name='timing']:checked").map(function() {
                  //start = 
                  //this.value};
                  return JSON.parse(this.value);
               //return this.value;
               }).get();
               getAvailableTimes(timing);
               
          break;
         
          case 4: // next was clicked on the select timeslot tab
          
               var $valid = $('#timeslot_select form').valid();
                  if (!$valid) {
                     return false; //do not navigate to next slide
                  }else{
                     selected_timeslot = $("input:radio[name ='proposition']:checked").val();
                     selected_timeslot = JSON.parse (selected_timeslot);
                     //alert(selected_timeslot);
                     
                     $('#resume .patient').html(objPatient.patient_surname + ' ' +objPatient.patient_firstname);
                     $('#resume .practitioner').html(practitioner.display_name);
                     $('#resume .location').html(clinic.name);
                     $('#resume .timeslot').html(moment(selected_timeslot.start).locale('nl-be').format('LLLL'));
                     
                  }
               
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
  
  
  
  $('.btn-finish').click(function(){
   $('.btn-finish-saving').show();
   $('.btn-finish').hide();
   
   //construct the appointment

   switch (mode)
   {
     case 'recurrentPatient':
       var appointment  = {userID:practitioner.ID,clinic:clinic.ID,patientID:objPatient.patient_id,start:selected_timeslot.start,end:selected_timeslot.end,service:practitioner.default_service.service,status:0}
       appointment = JSON.stringify(appointment);
       addAppointment(appointment);

       


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

          var appointment  = {userID:practitioner.ID,clinic:clinic.ID,patientID:objPatient.patient_id,start:selected_timeslot.start,end:selected_timeslot.end,service:practitioner.default_service_np.service,status:0}
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
    $('#resume_details').hide();
    $.ajax({
         
      url: apiURL,
      dataType: "json",
      data: {
         task: 'addAppointment',
         appointment:appointment
         
         //comment:$('#timing #comment').val()
      },
      
      }).done(function() {
         $('#resume .loading').hide();
         $('.btn-finish-saving').hide();
         $('.btn-previous').hide();
         $('#resume_details').hide();
         $('#confirmed').show();
         $('.btn-restart').show();
         //$('.btn-finish').show();
         //show the confirmation page
         
      }).fail(function(){
         $('#resume .loading').hide();
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
      
    wizard = $(this).closest('.wizard-card');
    wizard.find('[data-toggle="wizard-radio"]').removeClass('active');
    $(this).addClass('active');
    $(wizard).find('[type="radio"]').removeAttr('checked');
    $(this).find('[type="radio"]').attr('checked', 'true');
    
    //as soon as a clinic is selected.. get the practitioners and pre-load them into next slide
    $('#practitioner .practitioners').html('');
    getPractitionersFromClinic($("input:radio[name ='clinic']:checked").val());
    
  });
  
  $('.practitioners').on('click','[data-toggle="wizard-radio"]',function() {
      
    wizard = $(this).closest('.wizard-card');
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


function getAvailableTimes(timing){
   //clear the propositions if there would be any...
   $('#loading').html(loadingImg).show();
   $('#calendar').hide();
   $('#message_propositions').hide();
   $('#timeslot_select .propositions').html('');

   //practitioner = practitioners.find(x => x.ID === parseInt(practitioner.ID));
   $.each(practitioners, function() {
     if (this.ID == practitioner.ID){
       practitioner=this;
      }
    });
   switch(mode){
     case 'recurrentPatient':
       duration = practitioner.default_service.duration;
     break;
     case 'newPatient':
      duration = practitioner.default_service_np.duration;
     break;
    }
   $.ajax({
                  dataType: "json",
                  url: apiURL,
                  data: {
                    task: 'getAvailableTimes',
                    clinic: clinic.ID,
                    user : practitioner.ID,
                    duration:duration,
                    timing : JSON.stringify(timing)
                  }
                }).done(function(propositions) {
              
                $('#timeslot_select .propositions').html('');
                $('#loading').hide();
                $('#calendar').show();
                calendar.setEventsData(propositions);   
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
                var patient = {
                  surname: surname,
                  firstname: firstname,
                  dob: dob,
                  email: email
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
                    
                    wizard.bootstrapWizard('next');
                  } else {
                    $('#message').html('helaas hebben we geen gegevens van u !');
                    
                    
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
            var html='<div class="col-sm-12 col-xs-12 col-md-4"><div class="choice" data-toggle="wizard-radio"><input type="radio" name="practitioner" value="%practitionerID%" practitionerName="%practitionerName2%"><div class="card card-checkboxes card-hover-effect"><i class="ti-user"></i><p>%practitionerName%</p></div></div></div>';
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
                          newhtml = html.replace('%practitionerID%',this.ID);
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
    //error.log('this is the group=' + params.group);
    return params.group;
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
