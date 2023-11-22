class Cast {
    
    constructor(url,user){
        this.socket = io(url);
        this.user = 1;
        this.socket.on('calendar_changed',function(){
            console.log('calendar changed');
            calendar.fullCalendar( 'refetchEvents' );
            getRoomStatuses();
        });

    }
    payment(payment){
        this.socket.emit('castPayment',{castID:this.user,payment:payment});
        
    }

    calendarChanged(message){
        this.socket.emit('calendar_changed');
    }
    
  }
  
  
  
  