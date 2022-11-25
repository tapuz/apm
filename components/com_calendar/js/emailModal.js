var $validatorSendEmail;

$(document).ready(function() {
    $validatorSendEmail = $('#sendEmailForm').validate({
        rules:{
            to:{
                required:true,
                email: true
            },
            subject:{
                required:true
            },
            body:{
                required:true
            }
                
        },
        messages:{
            to:'supply a valid email address',
            subject:'supply a subject',
            body:'supply an email message'
        }



        });

    $(document).on('click','#emailModal .sendEmail',function() {
        
            if(!$('#sendEmailForm').valid()) {
                return;
            }
            
            const mail = new Object();
            mail.to = $('#sendEmailForm .to').val();
            mail.from = $('#sendEmailForm .from').val();
            mail.subject = $('#sendEmailForm .subject').val();
            mail.body = $('#sendEmailForm .body').val().replace(/\r?\n/g, '<br />');
            
            log(mail);
            
            $('#emailModal .sendEmail').html('Sending...');
            
            Email.send(JSON.stringify(mail),function(data){
    
                    if (data == 200){
                        var message = new Noty({
                            text: '<span class="text-center">Mail sent!</span><span class="pull-right"><i class="fa fa-times-circle">&nbsp;</i></span>',
                            //closeWith:'click',
                            layout:'topCenter',
                            theme:'sunset',
                            type:'success',
                            timeout : '2000'
                            }).show();
                        $('#emailModal').modal('hide');
                    } else {
                        var message = new Noty({
                            text: '<span class="text-center">'+data+'</span><span class="pull-right"><i class="fa fa-times-circle">&nbsp;</i></span>',
                            //closeWith:'click',
                            layout:'topCenter',
                            theme:'sunset',
                            type:'success',
                            timeout : '2000'
                            }).show();
                    }
                    $('#emailModal .sendEmail').html('Send email');
            });
            
            log(JSON.stringify(mail));
            
            
            
    });


});