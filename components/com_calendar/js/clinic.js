class Clinic {
    static getClinics(callback){
        $.ajax({
            url: "ajax.php",
            dataType: "json",
            type: 'get',
            data: {
                com: 'calendar',
                task: 'getClinics'
                
      },
      success: function(data) {
        if (callback) {
          callback(data);
        }
      }
    });
    }

    static getRoomsStatusClinic(clinic,callback){
      $.ajax({
          url: "ajax.php",
          dataType: "json",
          type: 'get',
          data: {
              com: 'calendar',
              task: 'getRoomsStatusClinic',
              clinic : clinic
              
    },
    success: function(data) {
      if (callback) {
        callback(data);
      }
    }
  });
  }


  static getFreeRooms(clinic,practitioner,callback){
    $.ajax({
        url: "ajax.php",
        dataType: "json",
        type: 'get',
        data: {
            com: 'calendar',
            task: 'getFreeRooms',
            clinic : clinic,
            practitioner : practitioner
            
  },
  success: function(data) {
    if (callback) {
      callback(data);
    }
  }
});
}

static emptyRoom(room_id,callback){
  $.ajax({
      url: "ajax.php",
      type: 'get',
      data: {
          com: 'calendar',
          task: 'emptyRoom',
          room_id : room_id
          
},
success: function(data) {
  if (callback) {
    callback(data);
  }
}
});
}

  static alocateAppointmentToRoom(appointment_id,room_id,callback){
    $.ajax({
        url: "ajax.php",
        //dataType: "json",
        type: 'get',
        data: {
            com: 'calendar',
            task: 'alocateAppointmentToRoom',
            appointment_id : appointment_id ,
            room_id : room_id
            
  },
  success: function(data) {
    if (callback) {
      callback(data);
    }
  }
  });
  }


    
}