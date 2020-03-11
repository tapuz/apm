$(function() {
    var tmpl_working_plan = $('#tmpl_working_plan').html();
    Mustache.parse(tmpl_working_plan);

    log(workingPlan);
    //clinics[0].working_plan = workingPlan[];
    var result1 = $.grep(workingPlan, function(e){ return e.clinic == '1'; });
    log(result1[0].workingPlan);
    log(clinics);
    
    $.each(clinics, function() {
        var index = workingPlan.map(e => e.clinic).indexOf(this.clinic_id );
        this.working_plan =workingPlan[index].workingPlan;
      });

      log (clinics)
      

    var rendered = Mustache.render(tmpl_working_plan,
        {clinics:clinics
        });


$('.working_plan').html(rendered);



$('.working-plan input[type="checkbox"]').click(function() {

var class1=$(this).prop('class') ;

//alert(class1);

  if ($(this).prop('checked') == true) {
    $("." + class1).prop('disabled',false);
    $(this).prop('disabled',false);
    
    //$(this).closest("tr").find("input[type='text']").prop('disabled',false);
  } else {
    $("." + class1).prop('disabled',true);
    $(this).prop('disabled',false);
    //$(this).closest("tr").find("input[type='text']").prop('disabled',true );
  }
});

$('.working-plan .add-break').click(function() {
  var newEl = ' <tr><td>&nbsp;</td><td><input class="{{clinic_id}}monday form-control input" type="text" value="{{start}}"</td><td><input class="{{clinic_id}}monday form-control input" type="text" value="{{end}}"</td><td><button type="button" class="btn btn-danger btn-sm delete-break" title="Delete"><span class="glyphicon glyphicon-remove"></span></button></td></tr>';

  $(this).closest("tr").after(newEl);

});




 







});