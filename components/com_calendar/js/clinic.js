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
    
}