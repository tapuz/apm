$(function() {

  var days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    
    var tmpl_working_plan = $('#tmpl_working_plan').html();
    Mustache.parse(tmpl_working_plan);

    log(workingPlan);
   
    log(clinics);
    
    $.each(clinics, function() {
        var index = workingPlan.map(e => e.clinic).indexOf(this.clinic_id );
        this.working_plan = workingPlan[index].workingPlan;
        this.color = workingPlan[index].color;
        //this.working_plan.days = days;
      });

      log (clinics)
      

    var rendered = Mustache.render(tmpl_working_plan,
        {clinics:clinics,
          days:days
        });


$('.working_plan_container').html(rendered);



$('#workingPlanTabs.nav-tabs a:first').tab('show'); 
//hide the non working day time-selects.. 
$('.timepicker').timepicker({ 'timeFormat': 'H:i',
                              'step': 15, 
                              'minTime': '07:00',
	                            'maxTime': '22:00',
                            
                            });
$('.colorpicker').spectrum({
  type: "text",
  togglePaletteOnly: "true",
  hideAfterPaletteSelect: "true",
  showInput: "true",
  showAlpha: "false",
  showButtons: "false",
  showInput: true,
  allowEmpty:true



});
$('.inactive').toggle();


$('.day-group input[type="checkbox"]').click(function() {
  $(this).closest(".day-group").find('.time-select').fadeToggle();

});

$('.day-group .add-break').click(function() {
var newEl = `
<div class="row day-break">
<div class="col-sm-2"></div>  
<div class="col-sm-2">
    <input class="timepicker break-start form-control input" type="text" value="">
</div>
<div class="col-sm-2">
    <input class="timepicker break-end form-control input" type="text" value="">
</div>
<div class="col-sm-1">
    <button type="button" class="btn btn-danger btn-sm delete-break" title="Delete"><span class="glyphicon glyphicon-remove"></span></button>
</div>`;

  var t = $(this).closest(".day-group").find(".day-breaks").after(newEl);
  log(t);
  $('.timepicker').timepicker({ 'timeFormat': 'H:i',
                              'step': 15, 
                              'minTime': '07:00',
	                            'maxTime': '22:00',
                            
                            });

});

$(document).on('click','.day-group .delete-break',function(){

  $(this).closest(".day-break").remove();

});

$('.save_working_plan').click(function() {

  //first check if there are empty fields
  
  if(!$("input:not(:hidden)").filter(function () {return $.trim($(this).val()).length == 0}).length == 0){
    Message = new Noty({
      text: '<span class="text-center">Cannot save the working plan. There are empty fields...</span><span class="pull-right"><i class="fa fa-times-circle">&nbsp;</i></span>',
      //closeWith:'click',
      layout:'center',
      theme:'sunset',
      type:'error'
      
      }).show();
    return true;
  }

  
  
  var plan = new Array();
  $.each(clinics, function() {
    var clinic = new Object();
     
    var clinicID = this.clinic_id;
    clinic.clinic = clinicID;
    clinic.color = $('#' + clinicID +' .colorpicker').val();
    clinic.workingPlan = new Array();
    //clinic.workingPlan = new Object();

    

    var dagen = new Object();

    log(clinicID);
    $.each(days, function(i, day_) {
      //if day is not selected go to next day
      
      if($('#' + clinicID +' .'+day_+ ' input:checkbox').prop('checked') == true){
        
      
      
      var dayDetails = new Object();
      var breaks = new Array;
      dayDetails.dow = i;
      dayDetails.start = $('#' + clinicID +' .'+day_+ ' .work-start').val();
      dayDetails.end = $('#' + clinicID +' .'+day_+ ' .work-end').val();
      
      $('#' + clinicID +' .'+day_+ ' .day-break').each(function(i,el){
        var breakDetails = new Object();
        breakDetails.start = $(el).find('.break-start').val();
        breakDetails.end = $(el).find('.break-end').val();
        breaks.push(breakDetails);
        
      });
        
      temp = new Object;

      dayDetails.breaks = breaks;
      dagen[day_] = dayDetails;
      
      //clinic.workingPlan.push(day);
      
      //clinic.workingPlan[day_] = dayDetails;
    }else{
      return true;
    }

    });
    clinic.workingPlan.push(dagen);
    plan.push(clinic);

  });
  log(JSON.stringify(plan));
  //save the plan to DB
  $.ajax({
    url: "ajax.php",
    type: 'post',
    data: {
      com: 'settings',
      task: 'save_workingplan',
      working_plan : JSON.stringify(plan),
    },
    success: function(data) {
      Message = new Noty({
        text: '<span class="text-center">Working plan saved!</span><span class="pull-right"><i class="fa fa-times-circle">&nbsp;</i></span>',
        //closeWith:'click',
        layout:'top',
        theme:'sunset',
        type:'success',
        timeout: 1500 
        
        }).show();
      
    },
    fail: function(){
      Message = new Noty({
        text: '<span class="text-center">There was an error saving the working plan!</span><span class="pull-right"><i class="fa fa-times-circle">&nbsp;</i></span>',
        //closeWith:'click',
        layout:'center',
        theme:'sunset',
        type:'error'
        
        }).show();
      }
  });
 
});


 







});