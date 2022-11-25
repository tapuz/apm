class Email {
  static send(oMail, callback) {
    
    $.ajax({
      url: "ajax.php",
      //dataType: "json",
      type: 'post',
      data: {
        com: 'calendar',
        task: 'sendEmail',
        data:JSON.stringify(oMail)

      },
      success: function(data) {
        callback(data);
      }
    });
  }
  
  
}