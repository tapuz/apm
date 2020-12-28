class Payment {
  
  static add(oPayment){
     $.ajax({
      url: "ajax.php",
      //dataType: "json",
      type: 'post',
      data: {
        com: 'payment',
        task: 'addPayment',
        payment: JSON.stringify(oPayment)
      },
      success: function() {
         $('#paymentModal').modal('hide');
        var message = new Noty({
          text: '<span class="text-center">Payment registered!!</span><span class="pull-right"><i class="fa fa-times-circle">&nbsp;</i></span>',
          //closeWith:'click',
          layout:'topCenter',
          theme:'sunset',
          type:'success',
          timeout : '2000'
          }).show();
      },
      error: function(req, status, error) {
      
        var message = new Noty({
          text: '<span class="text-center">'+ req.responseText +'</span><span class="pull-right"><i class="fa fa-times-circle">&nbsp;</i></span>',
          //closeWith:'click',
          layout:'topCenter',
          theme:'sunset',
          type:'error',
          timeout : '5000'
          }).show();
      }
     });  
    
    
  }
  
}



