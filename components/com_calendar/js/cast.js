class Cast {
    
    constructor(url,user){
        this.socket = io(url);
        this.user = 1;
        this.socket.on('calendar_changed',function(){
            console.log('calendar changed');
            calendar.fullCalendar( 'refetchEvents' );
          });

    }
    payment(amount){
        this.socket.emit('castPayment',{castID:this.user,amount:amount});
        
    }

    calendarChanged(){
        this.socket.emit('calendar_changed');
    }
  
  
    
  }
  
  
  
  