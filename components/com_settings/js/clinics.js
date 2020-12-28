$(function() {

    
    var tmpl_clinics = $('#tmpl_clinics').html();
    Mustache.parse(tmpl_clinics);

   
    
      

    var rendered = Mustache.render(tmpl_clinics,
        {clinics:clinics
       });


$('.clinics_container').html(rendered);



$('#clinicsTabs.nav-tabs a:first').tab('show'); 
//hide the non working day time-selects.. 


$('.clinic_settings_form').on('submit', function(e) {
    e.preventDefault();
    form = $(this);
    form = ($(this).serializeArray());
    log('THIS IS THE FORM -->' + form);

    //save the clinc
    
        $.ajax({
          url: "ajax.php",
          
          type: 'post',
        
          data: {
            com: 'settings',
            task: 'update_clinic',
            clinic:JSON.stringify(form)
            
          },
          success: function(data) {
            Message = new Noty({
                text: '<span class="text-center">Clinic settings saved!</span><span class="pull-right"><i class="fa fa-times-circle">&nbsp;</i></span>',
                //closeWith:'click',
                layout:'top',
                theme:'sunset',
                type:'success',
                timeout: 1500 
                
                }).show();
          },
          error : function(jqXHR, textStatus, errorThrown){
            log(textStatus);
            Message = new Noty({
                text: '<span class="text-center">There was an error while saving!' + textStatus + '</span><span class="pull-right"><i class="fa fa-times-circle">&nbsp;</i></span>',
                //closeWith:'click',
                layout:'center',
                theme:'sunset',
                type:'error'
                
                }).show();
          }
        });
      




});

});





