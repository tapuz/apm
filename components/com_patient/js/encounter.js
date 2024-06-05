class Encounter
{
    static getAll(patient_id,callback){
      return $.ajax({
      url: "ajax.php",
      dataType: "json",
      type: 'get',
      data: {
        com: 'patient',
        task: 'getEncounters',
        patient_id:patient_id
      },
      success: function(data) {
        if(callback){callback(data);}
      }
     });
    }
    
    static add(oEncounter,callback){
    
     $.ajax({
      url: "ajax.php",
      dataType: "json",
      type: 'post',
      data: {
        com: 'patient',
        task: 'addEncounter',
        encounter: JSON.stringify(oEncounter)
      },
      success: function(data) {
        if(callback){callback(data);}
      }
     });
    }

    static delete(encounter_id,callback){
      $.ajax({
       url: "ajax.php",
       //dataType: "json",
       type: 'post',
       data: {
         com: 'patient',
         task: 'deleteEncounter',
         encounter_id: encounter_id
       },
       success: function(data) {
         if(callback){callback(data);}
       }
      });
     }
    
    

    
}