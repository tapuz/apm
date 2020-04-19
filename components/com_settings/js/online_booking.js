$(function() {

    
    var tmpl_online_booking = $('#tmpl_online_booking').html();
    Mustache.parse(tmpl_online_booking);

   
    
      //settings = JSON.parse(settings);

    var rendered = Mustache.render(tmpl_online_booking,
        {settings:settings
       });


$('.settings_container').html(rendered);


$('.save_online_booking_settings').on('click',function() {

});



$('#online_booking_settings').on('submit', function(e) {
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
            task: 'update_online_booking_settings',
            settings:JSON.stringify(form)
            
          },
          success: function(data) {
            Message = new Noty({
                text: '<span class="text-center">Settings saved!</span><span class="pull-right"><i class="fa fa-times-circle">&nbsp;</i></span>',
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