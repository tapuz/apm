$.jStorage.deleteKey("clinics");
$.jStorage.deleteKey("fees");
$.jStorage.deleteKey("practitioners");
//function addPayment(){
//$.ajax({type: "post", url: "ajax.php", dataType: "json",
//  data: { com: 'payment',task: 'get_clinics'}
//    }).done(function( data ) {
//		alert(data[0].clinic_id);
//	});

//}

//$.jStorage.set("clinics","");
//$.jStorage.set("fees","");


var selectClinics;
var selectFee='';
var selectPractitioner;

// get all the practitioners
 $.ajax({type: "post", url: "ajax.php", dataType: "json",
          data: { com: 'payment',task: 'get_users'}
            }).done(function( data ) {
		        $.jStorage.set("practitioners",data);
		        console.log(data);
		        var practitioners = $.jStorage.get("practitioners");
                console.log(practitioners);
                
                default_practitioner_id = $('#practitioner_id').val();
                // make the practitioner selector and select the active practitioner as defaultvalue
    
                 selectPractitioner = "<select id='practitioner' name='practitioner' class='form-control'>"
                $.each(practitioners, function(){
                if (this.data["ID"] == default_practitioner_id){ //set this value as selected 
                        selectPractitioner += "<option value=" + this.data["ID"]  + " selected>" + this.data["display_name"] + "</option>";
                    } else {
                        selectPractitioner += "<option value=" + this.data["ID"]  + ">" + this.data["display_name"]  + "</option>";        
                    }
					
	            });
                selectPractitioner += "</select>";
    
		
	        });


    //get all the clinics
      $.ajax({type: "post", url: "ajax.php", dataType: "json",
          data: { com: 'payment',task: 'get_clinics'}
            }).done(function( data ) {
		        $.jStorage.set("clinics",data);
		        console.log(data);
		        var clinics = $.jStorage.get("clinics");
                console.log(clinics);
                //get the patient's clinic_id for the default value
                default_clinic_id = $('#clinic_id').val();
                // make the clinic selector and select the clinic the patient is linked with as defaultvalue
    
                 selectClinics = "<select id='clinics' name='clinics' class='form-control'>"
                $.each(clinics, function(){
                if (this.clinic_id == default_clinic_id){ //set this value as selected 
                        selectClinics += "<option value=" + this.clinic_id  + " selected>" + this.clinic_name + "</option>";
                    } else {
                        selectClinics += "<option value=" + this.clinic_id  + ">" + this.clinic_name + "</option>";        
                    }
                 
	            });
                selectClinics += "</select>";
    
		
	        });

    
    
        
    // get all the fees
    $.ajax({type: "post", url: "ajax.php", dataType: "json",
          data: { com: 'payment',task: 'get_fees'}
            }).done(function( data ) {
		        $.jStorage.set("fees",data);
		        var fees =  $.jStorage.get("fees");
	            //alert(clinics);
	            // make the fee selector - this has to be a radio select
	
            	var i=1;
            	$.each(fees,function(){
            	    selectFee += "<div class='radio'><label for='amount-"+i+"'>"; 
	              if (this.default == 1){ // this is the default fee - set is as checked              
	                 selectFee += "<input type='radio' name='amount' id='amount-"+i+"' value='"+ this.fee +"' checked>€"+ this.fee +" </label>";
                    }else {
                     selectFee += "<input type='radio' name='amount' id='amount-"+i+"' value='"+ this.fee +"'>€"+ this.fee +" </label>";
        
                   }
                selectFee += "</div>";
	            i++;
	    
            	});
	
		
	        });
		        
		        
function addPayment__() {
		message = $('#add_class_form').html();
    bootbox.dialog({
				
                title: "Add payment for <strong> " + $('#patient_name').val() + "</strong>"   ,
                message: message,
                buttons: {
                    success: {
                        label: "Add Payment",
                        className: "btn-success",
                        callback: function () {
                            var description = $('#description').val();
                            var amount = $("input[name='amount']:checked").val();
                            var clinic = $("#clinics").val();
                            var practitioner_id = $("#practitioner").val();
                            var patient_id = $('#patient_id').val();
                            alert(clinic);
							
							
                            //make the ajax call 
                            
                            $.ajax({
  			                    type: "post",
		                        url: "ajax.php",
  			                    data: { com: 'payment', 
  					                    task: 'add_payment', 
  					                    patient_id: patient_id,
  					                    practitioner_id: practitioner_id,
										clinic: clinic,
  					                    amount: amount,
  					                    description: description}
			                    }).done(function( response ) {
				                    
					                var n = noty({text: getResponse(response) ,type: 'success',layout:'topCenter'});
				                	//console.log(getResponse(response));
			                });
                            
                            
                            //console.log (practitioner_id); 
                           
                        }
                    }
                }
            }
        );
}


function addPayment(){
    
    console.log($('#practitioner_id').val());
	
	
	//console.log(selectFee);
	
      bootbox.dialog({
				
                title: "Add payment for <strong> " + $('#patient_name').val() + "</strong>"   ,
                message: '<div class="row">  ' +  
                    '<div class="col-md-12"> ' + 
                    '<form class="form-horizontal"> ' +
					 '<div class="form-group"> ' +
                    '<label class="col-md-4 control-label" for="date">Date</label> ' +
                    '<div class="col-md-4"> ' +
                    '<input id="payment_date" name="payment_date" type="text" placeholder="Date" class="form-control input-md" value="'+ moment().format('DD/MM/YYYY') +'"> ' +
                    '</div> ' +
                    '</div> ' +
                    '<div class="form-group"> ' +
                    '<label class="col-md-4 control-label" for="clinics">Clinic</label> ' +
                    '<div class="col-md-6"> ' +
                    selectClinics +
                    '<span class="help-block">Select clinic receiving payment</span> </div> ' +
                    '</div> ' +
                    
                    '<div class="form-group"> ' +
                    '<label class="col-md-4 control-label" for="practitioner">Practitioner</label> ' +
                    '<div class="col-md-6"> ' +
                    selectPractitioner +
                    '<span class="help-block">Select practitioner receiving payment</span> </div> ' +
                    '</div> ' +
                    
                    '<div class="form-group"> ' +
                    '<label class="col-md-4 control-label" for="description">Description</label> ' +
                    '<div class="col-md-4"> ' +
                    '<input id="description" name="description" type="text" placeholder="Description" class="form-control input-md" value="Consultatie"> ' +
                    '<span class="help-block">Enter description of payment</span> </div> ' +
                    '</div> ' +
                    '<div class="form-group"> ' +
                    '<label class="col-md-4 control-label" for="amount">Amount</label> ' +
                    '<div class="col-md-4">'+ 
                     selectFee +
                    '</div> </div>' +
                    '<label class="col-md-4 control-label" for="custom_amount">Other amount</label> ' +
                    '<div class="form-group has-error"> ' +
                    '<div class="col-md-6"> ' +
                    '<input id="description" name="description" type="text" placeholder="Description" class="form-control input-md" value="DO NOT USE THIS YET"> ' +
                    
                    '</div></div> ' +
                    '</form> </div>  </div>',
                buttons: {
                    success: {
                        label: "Add Payment",
                        className: "btn-success",
                        callback: function () {
                            var description = $('#description').val();
                            var amount = $("input[name='amount']:checked").val();
							var payment_date = $('#payment_date').val();
                            var clinic = $("#clinics").val();
                            var practitioner_id = $("#practitioner").val();
                            var patient_id = $('#patient_id').val();
                            alert(payment_date);
							
							
                            //make the ajax call 
                            
                            $.ajax({
  			                    type: "post",
		                        url: "ajax.php",
  			                    data: { com: 'payment', 
  					                    task: 'add_payment', 
  					                    patient_id: patient_id,
  					                    practitioner_id: practitioner_id,
										clinic: clinic,
  					                    amount: amount,
										payment_date : payment_date,
  					                    description: description}
			                    }).done(function( response ) {
				                    
					                var n = noty({text: getResponse(response) ,type: 'success',layout:'topCenter'});
									//add new task to table
									var html = '<tr id="'+invoice_item_id+'"> \
												<td>Consultatie ' + appointment_date + '</td> \
								                <td><div class="input-prepend input-group"> \
										           <span class="input-group-addon">€</span> \
										        <input id="appendedPrependedInput" class="form-control item_price" size="16" type="text" value="'+item_price+'"> \
									            </div></td> \
												<td><a class="btn btn-danger delete_invoice_item glyphicon glyphicon-remove" invoice_item_id="'+invoice_item_id+'" payment_id="'+ payment_id +'"></a></td>\
												</tr>';
				
				$("#invoice_items tr:last").before(html);
				                	//console.log(getResponse(response));
			                });
                            
                            
                            //console.log (practitioner_id); 
                           
                        }
                    }
                }
            }
        );
         
		
}


