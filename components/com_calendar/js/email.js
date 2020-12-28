class Email {
  static send(oMail, callback) {
    
    $.ajax({
      url: "ajax.php",
      //dataType: "json",
      type: 'post',
      data: {
        com: 'calendar',
        task: 'send_email',
        patient:JSON.stringify(oMail)

      },
      success: function(data) {
        callback(data);
      }
    });
  }
  
  
}