class SOAP
{
    static add(oSOAP,callback){
    
     $.ajax({
      url: "ajax.php",
      dataType: "json",
      type: 'post',
      data: {
        com: 'patient',
        task: 'addSOAP',
        SOAP: JSON.stringify(oSOAP)
      },
      success: function(data) {
        if(callback){callback(data);}
      }
     });
    }
 
  
  static updateAsync(oSOAP) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: 'ajax.php',
      dataType: 'json',
      type: 'post',
      timeout: 20000,
      data: {
        com: 'patient',
        task: 'updateSOAP',
        SOAP: JSON.stringify(oSOAP)
      }
    })
    .done(function (data) {
      // Normalize backend response
      if (data && (data.success === true || data.success == 1)) {
        data.success = true;
      } else {
        data = data || {};
        data.success = false;
      }

      resolve(data);
    })
    .fail(function (xhr, textStatus, errorThrown) {
      console.error('SOAP.updateAsync AJAX failed', {
        textStatus,
        errorThrown,
        status: xhr.status,
        response: xhr.responseText
      });

      reject({
        success: false,
        error: textStatus || 'ajax_failed',
        status: xhr.status,
        response: xhr.responseText
      });
    });
  });
}

  static update(oSOAP,callback){
        
    $.ajax({
      url: "ajax.php",
      dataType: "json",
      type: 'post',
      data: {
        com: 'patient',
        task: 'updateSOAP',
        SOAP: JSON.stringify(oSOAP)
      },
      success: function(data) {
        if(callback){callback(data);}
      }
     });
    }
    
  static async save(soap_id,field,value){
    const result = await
      $.ajax({
       url: "ajax.php",
       //dataType: "json",
       type: 'post',
       data: {
         com: 'patient',
         task: 'saveSOAP',
         soap_id: soap_id,
         field:field,
         value:value
       }
       });
    return 'THIS IS COOL DUDE';
       
     }
     
    
}


