class Complaint
{
    static getAll(patient_id,callback){
        $.ajax({
      url: "ajax.php",
      dataType: "json",
      type: 'get',
      data: {
        com: 'patient',
        task: 'getComplaints',
        patient_id:patient_id
      },
      success: function(data) {
        if(callback){callback(data);}
      }
     });
    }
    
    static add(oComplaint,callback){
    
     $.ajax({
      url: "ajax.php",
      dataType: "json",
      type: 'post',
      data: {
        com: 'patient',
        task: 'addComplaint',
        complaint: JSON.stringify(oComplaint)
      },
      success: function(data) {
        if(callback){callback(data);}
      }
     });
    }
    
    static save(complaint_id,field,value,callback){
    
     $.ajax({
      url: "ajax.php",
      //dataType: "json",
      type: 'post',
      data: {
        com: 'patient',
        task: 'saveComplaint',
        complaint_id: complaint_id,
        field:field,
        value:value
      },
      success: function(data) {
        if(callback){callback(data);}
      }
     });
    }
    

    static delete(complaint_id,callback){
    
      $.ajax({
       url: "ajax.php",
       //dataType: "json",
       type: 'post',
       data: {
         com: 'patient',
         task: 'deleteComplaint',
         complaint_id: complaint_id
       },
       success: function(data) {
         if(callback){callback(data);}
       }
      });
     }
    
    
    

    
}