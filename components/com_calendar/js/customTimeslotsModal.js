var slotDiv;
$(document).ready(function() {
    /* var checkSelectedUser = setInterval(function() {
        log(selectedUser);
        if (selectedUser !== '') {
            clearInterval(checkSelectedUser); // Stop checking
            console.log("#######Selected User:", selectedUser); // Use the value
            renderCustomTimeslotsList();
        } 
        }, 1000); // Check every 100 milliseconds */

        $(document).on('click','#customTimeslotsModal .delete',function(){
            slotDiv = $(this).closest('.slot');
            Appointment.deleteCustomTimeslot($(this).data("id"),function(){
                calendar.fullCalendar( 'refetchEvents' );
                slotDiv.remove();
            }); 
            
          });       
});


function renderCustomTimeslotsList(){
    // Function to check the value of selectedUser       
        var currentDate = moment($('#calendar').fullCalendar('getDate')).format('YYYY-MM-DD');
        Appointment.getCustomTimeslots(selectedUser,currentDate,function(data){
            var slots='';
            $.each(data, function(){
                //let duration = moment.duration(this.end.diff(this.start));
                //console.log(this.start.diff(b, 'minutes')) // 44700
                let duration = moment.duration(moment(this.end).diff(moment(this.start)));
                slots += '<div class="slot row"><div class="col-md-3"><span class="label" style="background:'+ this.color +'">' + this.name +' &nbsp;</span></div><div class="col-md-5"><strong>'+ this.title+' |</strong><span class="logDateTime"> &nbsp;'+ moment(this.start).format('LLLL') +' - ' + moment(this.end).format('LT') + ' (' + duration.asMinutes() +'min.)</span></div>';
                slots += '<div class="col-md-2"> &nbsp;<span><button data-id='+ this.id + ' type="button" class="btn btn-danger delete"><i class="fa fa-trash-o" aria-hidden="true"></i>&nbsp;Delete</button></span></div></div>';

            });
            $('#customTimeslotsModal .modal-body').html(slots);
                log(data);
            });
                
        }
