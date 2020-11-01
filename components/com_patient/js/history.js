class History
{
    static save(patient_id,field,value,callback){
    $.ajax({
      url: "ajax.php",
      //dataType: "json",
      type: 'post',
      data: { 
        com: 'patient',
        task: 'saveHistory',
        patient_id:patient_id,
        field:field,
        value:value
      },
      success: function(data) {
        if(callback){callback(data);}
      },
      error : function(jqXHR, textStatus, errorThrown){
        
        log(textStatus);
      }
     });
    }
    
    static get(patient_id,callback){
     return $.ajax({
      url: "ajax.php",
      dataType: "json",
      type: 'get',
      data: { 
        com: 'patient',
        task: 'getHistory',
        patient_id:patient_id
        
      },
      success: function(data) {
        if(callback){callback(data);}
        //return data;
        
      },
      error : function(jqXHR, textStatus, errorThrown){
        
        log(textStatus);
      }
     });
    }
}