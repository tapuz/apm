$(function() {

 
    
    var tmpl_clinics = $('#tmpl_clinics').html();
    Mustache.parse(tmpl_clinics);

   
    
      

    var rendered = Mustache.render(tmpl_clinics,
        {clinics:clinics
       });


$('.clinics_container').html(rendered);



$('#clinicsTabs.nav-tabs a:first').tab('show'); 
//hide the non working day time-selects.. 



});



