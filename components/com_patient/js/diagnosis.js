class Diagnosis
{
    static getDiagnosesPatient(patient_id,callback){
    return $.ajax({
      url: "ajax.php",
      dataType: "json",
      type: 'get',
      data: {
        com: 'patient',
        task: 'getDiagnoses',
        patient_id:patient_id
      },
      success: function(data) {
        if(callback){callback(data);}
      }
     });
    }
    
    //add diagnosis to complaint
    static add(sDiagnosis,callback){ 
    
     $.ajax({
      url: "ajax.php",
      dataType: "json",
      type: 'post',
      data: {
        com: 'patient',
        task: 'addDiagnosis',
        diagnosis: sDiagnosis
      },
      success: function(data) {
        if(callback){callback(data);}
      }
     });
    }
    
    static search(q,callback){
    $.ajax({
      url: "ajax.php",
      dataType: "json",
      type: 'get',
      data: {
        com: 'patient',
        task: 'searchDiagnoses',
        q: q
      },
      success: function(data) {
        if(callback){callback(data);}
      }
     }); 
        
    }
    //add a diagnosis to the diagnoses table (table_diagnoses)
    static addNew(diagnosis,callback){
    $.ajax({
      url: "ajax.php",
      dataType: "json",
      type: 'post',
      data: {
        com: 'patient',
        task: 'addNewDiagnosis',
        diagnosis: diagnosis
      },
      success: function(data) {
        if(callback){callback(data);}
      }
     }); 
        
    }
    
    
    

    
}