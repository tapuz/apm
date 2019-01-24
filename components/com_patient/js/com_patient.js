$(document).ready(function(){
	var fSOAPSaved = 1;
	var fSaveSuccess = 1;
	var fAllSaved = 1;
	var oEncounter;
	var encounters;
	var oPrevEncounter;	
	var diagnoses;
	var oHistory =null;
	//var to store diagnosis form to input elements after diagnosis selection
	var formDiagnosis;
	var oPatient;
	//hide the page and set the loading
	var notys = []; //array that contains all the notyfications
	
	
	//set the page title = patientName
	
	document.title = patientName;
	
	//set the Active patient
	window.addEventListener('focus', setActivePatient);

    function setActivePatient(){
        $.ajax({
            url: "ajax.php",
            type: 'post',
            data: {
              com: 'patient',
              task: 'set_active_patient',
              patient: patientID
            },
            success: function(data) {
              //
            }
           });
          }



	//minify the main menu
	$('#main-menu-min').click ();
	
	//append modals to body to avoid bg issue
	$('#diagnosesModal').appendTo("body");
	renderMain();
	
	function renderMain(){
		$.when(Patient.get(patientID),
			   History.get(patientID),
			   Encounter.getAll(patientID),
			   Diagnosis.getDiagnosesPatient(patientID)
			   ).then(function( data1,data2,data3,data4 ) {
			
			oPatient = data1[0];
			oHistory = data2[0];
			encounters = data3[0];
			diagnoses = data4[0];
			
			$('.left-content').show();
			
			renderTopPanel();
			renderEncounters();
			
			//assign previous encounter to var in order to use them in new encounter.. so user can copy this is new encounter
			oPrevEncounter = encounters[1];
			
		});
	}
	
	
	
	
	//grab the encounter timeline template
	//Grab the inline template
	
	var template_complaint_tab = $('#tmpl_complaint_tab').html();
	var template_complaint = $('#tmpl_complaint').html();
	var template_complaint_init = $('#tmpl_complaint_init').html();
	
	
	//Parse it 
	
	Mustache.parse(template_complaint);
	Mustache.parse(template_complaint_tab);
	Mustache.parse(template_complaint_init);
	
	
	var template = $('#tmpl_encounter').html();
	Mustache.parse(template);
	

	
	
	
	
	
	//populate the select diagnosis modal with diagnoses
	Diagnosis.search('%',function(data){
		$.each(data,function(){
			//filter the 'no diagnosis' from the list.. the one with id = 1
			if(this.id == 1){return true;}
			var html = '<a class="list-group-item list-diagnosis" diagnosis="'+ this.diagnosis +'" diagnosis_id="'+ this.id +'"><span>'+ this.diagnosis +'</span></a>';
			$("#searchlistDiagnoses").append(html);
			
		});
		$(".list-diagnosis").on("click", function () {
						//e.preventDefault();
						log($(this).attr('diagnosis'));
						log(formDiagnosis);
						formDiagnosis.find('.diagnosis').val($(this).attr('diagnosis'));
						formDiagnosis.find('.diagnosis_id').val($(this).attr('diagnosis_id'));
						saveDiagnosis(formDiagnosis);
						$("#diagnosesModal").modal("hide");
						
		});	
		
		
		
	});
	
	
	
	
	$('.encounter').live("click", function(){
		
		resetEncounter();
		var encounterID = $(this).attr('encounterID');
		oEncounter = encounters.find(x => x.id === encounterID);
		
		$('#SOAP_ID').val(oEncounter.soap_id);
		$('#subjective').val(oEncounter.subjective);
		$('#objective').val(oEncounter.objective);
		$('#assessment').val(oEncounter.assessment);
		$('#plan').val(oEncounter.plan);
		
		$('#tab_new_encounter').toggle();
		$('.nav-tabs a[href="#pane_new_encounter"]').tab('show');
		$('#btn_new_encounter').hide();
		
		
		
		renderHistory();
		//load the complaints
		initComplaint();
		renderComplaints();
		renderFlagnotifications();
		//load the history

		
	});
	
	
	$(document).on('click','#btn_new_encounter', function () {
		//toggle new encounter tab and create new encounter
		resetEncounter();
		renderHistory();
		renderFlagnotifications();
		$('#tab_new_encounter').toggle();
		$('.nav-tabs a[href="#pane_new_encounter"]').tab('show');
		$(this).hide();
		
		
		initComplaint();
		//load the history
		
		
		//create new encounter in DB
		Encounter.add(
			{
				patient_id:patientID,
				user:userID,
				start:moment().format(),
				type:1
				
			}, function(data) {
				oEncounter = data;
				log('Encounter: ');
				log(oEncounter);
				renderComplaints();
				//create New soap note and link to this encounter
				SOAP.add(
				   {
					encounter_id : oEncounter.id,
					patient_id: oEncounter.patient_id,
					user:oEncounter.user,
					created:oEncounter.start
					},function(SOAP){
						log('SOAP:');
						log(SOAP);
						log('the new SOAP ID : ' + SOAP.id);
						$('#SOAP_ID').val(SOAP.id);
						
					});
			
			});

	});
	
	$(document).on('change','#editSOAP .form-control',function() {
		log('changed!!');
		saveSOAP();
		fAllSaved = 0;
	});
	
	
		//reset the encounter so there is no old data from another encounter
	function resetEncounter(){
		$('#general_history').html('');
		$('#paediatric_history').html('');
		$('#editSOAP').trigger("reset");
	}
	
	function saveSOAP() {
		      
			$('#label_encounter_saving_error').hide();
			$('#label_encounter_saved').hide();
			$('#label_encounter_saving').show();
            SOAPform ="";
			SOAPform = $('#editSOAP').serializeArray();
			log(SOAPform);
			SOAP.update(SOAPform,function(data){
				fSaveSuccess = data.success;
				fSOAPSaved = data.success;
				setSaveStatus();
				if (data.success === 0){fAllSaved = 0;}
				log('saving soap');
			});
			
			
			
	} 
	
	function saveComplaint(form){
			$('#label_encounter_saving_error').hide();
			$('#label_encounter_saved').hide();
			$('#label_encounter_saving').show();
            
			ComplaintForm = form.serializeArray();
			log('serialized');
			log(ComplaintForm);
			Complaint.update(ComplaintForm,function(data){
				fSaveSuccess = data.success;
				//fSOAPSaved = data.success;
				setSaveStatus();
				if (data.success === 0){fAllSaved = 0;}
				log('saving complaint');
			});
		
	}
	
	function saveDiagnosis(form){
			$('#label_encounter_saving_error').hide();
			$('#label_encounter_saved').hide();
			$('#label_encounter_saving').show();
            
			
			DiagnosisForm = form.serialize();
			log('hier is m');
			log(DiagnosisForm);
			Diagnosis.add(DiagnosisForm,function(data){
				fSaveSuccess = data.success;
				//fSOAPSaved = data.success;
				setSaveStatus();
				if (data.success === 0){fAllSaved = 0;}
				log('saving diagnosis');
				
				//change the tab title to the new diagnosis
				$('#tab_complaint_' + form.find('.complaint').val()).html(form.find('.diagnosis').val());
				
			});
		
	}
	
	function setSaveStatus() {
		if (fSaveSuccess === 0) {// the encounter could not be saved....
			
			$('#label_encounter_saving_error').show();
			$('#label_encounter_saved').hide();
			$('#label_encounter_saving').hide();
		} else { // the encounter was saved correctely
			$('#label_encounter_saved').show();
			$('#label_encounter_saving').hide();
			
		}
	}
	
	
	 $(document).on('click','.btn_close_encounter',function(){
		//fAllSaved = 1;
		//$.when(saveSOAP(),saveComplaint()).done(function(){
			//log('second step');
			//if (fAllSaved === 0) {// there was a problem saving
			//	log('error saving');
			//} else {// all was saved well..close encounter
				Noty.closeAll();
				$('#tab_new_encounter').hide();
				$('.nav-tabs a[href="#pane_encounters"]').tab('show');
				$('#btn_new_encounter').show();
				renderMain();
				
				
				
				//$('#pane_new_complaint').removeClass('active');
				//$('#complaints-panel').hide();
				//$('#tab_new_complaint').hide();
				//$('.nav-tabs a[href="#pane_new_complaint"]').tab('hide');
				
				
			//}
		//});
		
	 });
	 
	 
	 $("#complaints_tabs .nav-tabs").on("click", function (e) {
        e.preventDefault();
        if (!$(this).hasClass('add_complaint')) {
            $(this).tab('show');
        }
      });
	 
	 
//	 $.ui.autocomplete.prototype._renderItem = function (ul, item) {
//    return $("<li></li>")
//      .data("item.autocomplete", item)
//      .append($("<a></a>").html(item.label))
//      .appendTo(ul);
//  }; 
	 
	 
	
	 
	 $('.unknown-diagnosis').live('click',function(){
		 Diagnosis.addNew($(this).attr('diagnosis'),function(data){
					formDiagnosis.find('.diagnosis').val(data.diagnosis);
					formDiagnosis.find('.diagnosis_id').val(data.id);
					saveDiagnosis(formDiagnosis);
					$("#diagnosesModal").modal("hide");
					var html = '<a class="list-group-item list-diagnosis" diagnosis="'+ data.diagnosis +'" diagnosis_id="'+ data.id +'"><span>'+ data.diagnosis +'</span></a>';
					$("#searchlistDiagnoses").prepend(html);
					
					});
		 
	 });
	 
	 $('#searchlistDiagnoses').btsListFilter('#searchinputDiagnoses', {
		emptyNode:function(data) {
					 
					return $('<a class="list-group-item well unknown-diagnosis" diagnosis="'+data+'" href="#"><span>Add <b>"'+data+'"</b> as new diagnosis</a>');
				  }
		//UN-COMMENT CODE BELOW TO ADD AJAX
		//FOR NOW THE DIAGNOSES ARE PRE-LOADED
		
		//loadingClass: 'loading',
		//sourceTmpl: '<a class="list-group-item list-diagnosis" diagnosis="{diagnosis}" diagnosis_id="{id}"><span>{diagnosis}</span></a>',
		//sourceData: function(text, callback) {
		//	
		//
		//	$.ajax({
		//		url: "ajax.php",
		//		dataType: "json",
		//		type: 'post',
		//		data: {
		//		  com: 'patient',
		//		  task: 'searchDiagnoses',
		//		  q: text
		//
		//		},
		//		success: function(data) {
		//			callback(data);
		//			 $(".list-diagnosis").on("click", function () {
		//				//e.preventDefault();
		//				log($(this).attr('diagnosis'));
		//				log(formDiagnosis);
		//				formDiagnosis.find('.diagnosis').val($(this).attr('diagnosis'));
		//				formDiagnosis.find('.diagnosis_id').val($(this).attr('diagnosis_id'));
		//				saveDiagnosis(formDiagnosis);
		//			});
		//		}
		//		
		//});
		//}
	});
	
	function addDiagnosisLookup(){ //NOT USED//
		$(".form_diagnosis .diagnosis").autocomplete({
			autoFocus: true,
			source: function(request, response) {
			  $.ajax({
				url: "ajax.php",
				dataType: "json",
				type: 'post',
				data: {
				  com: 'patient',
				  task: 'searchDiagnoses',
				  q: request.term
		
				},
				success: function(data) {
				  //console.log(data);
				  response($.map(data, function(item) {
					return {
					  label: item.diagnosis,
					  value: item.id
					  
					};
				  }));
		
				}
			  });
			},
			
			response: function (event, ui) {
				ui.content.push({
				label: "<input type='button' value='click me' class='mybutton' />",
				button: true
				});
			},
     
			minLength: 2,
			select: function(event, ui) {
				
			  event.preventDefault();
			  if (ui.item.button) {
				log('clicked');	
			  } else {
				$(this).parent().parent().find("input[name='diagnosis_id']").val(ui.item.value);
				$(this).val(ui.item.label);
				log ($(this).closest('ul .active'));
			  //$(this).closest('a').html(ui.item.label);
			  }
			
			},
			open: function() {
			  $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
			  log('searching');
			},
			close: function() {
			  $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
				 log('done searching');
			}
		  });
		  // add this option so the search results are properly appended to the input box  
		  $('.form diagnosis .diagnosis').autocomplete("option", "appendTo", ".patient-select");
		
	}

	function renderComplaints(){
		//filter the duplicate complaints..complaints with more than 1 diagnosis
		diagnoses.reverse();
		// Array to keep track of duplicates
		var dups = [];
		var filteredDiagnoses = diagnoses.filter(function(el) {
		 // If it is not a duplicate, return true
			if (dups.indexOf(el.complaint) == -1) {
				dups.push(el.complaint);
				return true;
			}
			return false;
		});
		
		$.each(filteredDiagnoses,function(){
		    
			var pane_id = 'complaint_' + this.complaint;
				
							//render the complaint
							var rendered = Mustache.render(template_complaint,
								{complaint_id : this.complaint,
								 patient_id: this.patient,
								 encounter_id : oEncounter.id,
								 //active : 'active',
								 pane_id : pane_id,
								 cc: this.cc,
								 ac:this.ac,
								 location:this.location,
								 onset:this.onset,
								 timing:this.timing,
								 intensity:this.intensity,
								 character:this.character,
								 aggravating:this.aggravating,
								 relieving:this.relieving,
								 previous_treatments:this.previous_treatments,
								 note:this.note,
							
								 diagnosis: this.diagnosis,
								 diagnosis_id: this.diagnosis_id,
								 diagnosis_comment: this.diagnosis_comment,
								 
								 wrapped:function () {
									return function (text) {
										 return text.replace('value="' + this.intensity+'"', 'value="' + this.intensity+'" checked').replace(/{{complaint_id}}/g,this.complaint_id);
									};
								}
								 
								});
							
							var rendered2 = Mustache.render(template_complaint_tab,
								{pane_name : pane_id,
								 tab_title: this.diagnosis,
								 complaint_tab_id : 'tab_' + pane_id
								});
							
							
							$('#complaints_panes').append(rendered);
							$('#complaints_tabs').append(rendered2);
							//select new complaint tab & focus on first element of form
							$('#tab_' + pane_id ).tab('show');
							//$('#' + pane_id + ' .cc').focus();
						
							
							$('.btn-open-diagnoses-modal').click(function(){
								formDiagnosis = $(this.form);
								$("#diagnosesModal").modal("show");
								});
							
							$('.form_diagnosis .form-control').on('change',function() {
								log('changed!! diagnosis');
								saveDiagnosis($(this.form));
								log('FORM');
								log($(this.form));
								fAllSaved = 0;
							});
							
							$('.tagsinput').tagsinput();
	
							
	
							
							//addDiagnosisLookup();
		});
	}
	
	
	function initComplaint(){
		var rendered = Mustache.render(template_complaint_init);
		$('#complaints-panel .panel-body').html(rendered);
		
		$('.add_complaint').click(function (e) {
		e.preventDefault();
		
		log('add complaint');
		
		
		
		Complaint.add({
						encounter_id: oEncounter.id,
						patient_id: oEncounter.patient_id,
						user: oEncounter.user,
						open: moment().format(),
						active:1
						},function(complaint){
							
							var pane_id = 'complaint_' + complaint.id;
							
							var rendered = Mustache.render(template_complaint,
								{complaint_id : complaint.id,
								 patient_id: oEncounter.patient_id,
								 encounter_id :oEncounter.id,
								 diagnosis_id: 1,
								 diagnosis:'no diagnosis',
								 //active : 'active',
								 pane_id : pane_id,
								 wrapped:function () {
									return function (text) {
									return text.replace('value="' + this.intensity+'"', 'value="' + this.intensity+'" checked').replace(/{{complaint_id}}/g,this.complaint_id);
									};
								}
								});
							
							var rendered2 = Mustache.render(template_complaint_tab,
								{pane_name : pane_id,
								 tab_title: 'new complaint',
								 complaint_tab_id : 'tab_' + pane_id
								});
							
							
							$('#complaints_panes').append(rendered);
							$('#complaints_tabs').append(rendered2);
							
							//
							form = $('#' + pane_id + ' .form_diagnosis');
							saveDiagnosis(form);
							//select new complaint tab & focus on first element of form
							$('#tab_' + pane_id ).tab('show');
							$('#' + pane_id + ' .cc').focus();
						
							
							$('.btn-open-diagnoses-modal').click(function(){
								formDiagnosis = $(this.form);
								$("#diagnosesModal").modal("show");
								});
							
							$('.form_diagnosis .form-control').on('change',function() {
								log('changed!! diagnosis');
								saveDiagnosis($(this.form));
								log('FORM');
								log($(this.form));
								fAllSaved = 0;
							});
							
							$('.tagsinput').tagsinput();
	
							
							//addDiagnosisLookup();
							
						});
		});
		
		
	}
	
	
	function renderTopPanel(){
		
		var template_top_panel = $('#tpml_top_panel').html();
		Mustache.parse(template_top_panel);
		
		var dob = moment(oPatient.dob,'YYYY-MM-DD').format('L');
		var age = moment().diff(oPatient.dob, 'years',false); //false gives a non fraction value

		var address = oPatient.address + ' - ' + oPatient.postcode + ' ' + oPatient.city + ' - ' + oPatient.country ;
		
		var data = {patient_name : oPatient.patient_surname + ' ' + oPatient.patient_firstname ,
					dob: dob,
					age : age,
					sex : oPatient.sex,
					profession : oPatient.profession,
					insurance : oPatient.insurance,
					practitioner : ' ',
					phone : oPatient.phone,
					email : oPatient.email,
					address : address,
					redflags : JSON.parse(oHistory.pmh),
					yellowflags: JSON.parse(oHistory.pmh)
					};
		var top_panel = Mustache.render(template_top_panel,data);
		
		
		
		$('#info').html(top_panel);

	}
	
	function renderFlagnotifications () {
		//render the red and yellow flag notys only when there are any
		var pmh = JSON.parse(oHistory.pmh);
		if (pmh !== null) {
			var index = 0;
			$.each(pmh,function(){
				if(this.redflag){
					var redflagtmpl = "{{#redflags}}{{#redflag}}<span>{{spacer}} {{condition}} </span>{{/redflag}}{{/redflags}}";
					var textR = Mustache.render(redflagtmpl,{redflags : pmh, spacer : function (){ index++; if (index > 1){ return ',';} } });
					redflags = new Noty({
						text: '<span class="text-center">'+textR+'</span><span class="pull-right"><i class="fa fa-times-circle">&nbsp;</i></span>',
						layout:'topRight',
						theme:'sunset',
						type:'error',
						callbacks: {afterClose: function() {}}
						}).show();
					
					return false;
				}
			});
			index = 0;
			$.each(pmh,function(){
				if(this.yellowflag){
					var yellowflagtmpl = "{{#yellowflags}}{{#yellowflag}}<span>{{spacer}} {{condition}} </span>{{/yellowflag}}{{/yellowflags}}";
					var textY = Mustache.render(yellowflagtmpl,{yellowflags : pmh, spacer : function (){ index++; if (index > 1){ return ',';} } });
					yellowflags = new Noty({
						text: '<span class="text-center">'+textY+'</span><span class="pull-right"><i class="fa fa-times-circle">&nbsp;</i></span>',
						layout:'topRight',
						theme:'sunset',
						type:'warning',
						callbacks: {afterClose: function() {}}
					}).show();
				return false;
				}
			});
		}
	}
	
	function renderEncounters(){
		var template_encounter_flow = $('#tmpl_encounter_flow').html();
		Mustache.parse(template_encounter_flow);
		$('.list-encounters').html(Mustache.render(template_encounter_flow));
		
		var template = $('#tmpl_encounter').html();
		Mustache.parse(template);
		$('#timeline').html('');    
		var encounterID;
		var Dx;
		$.each(encounters, function() {
			Dx = '';
			encounterID = this.id;
			encounterDate = this.start;
		$.each(diagnoses,function(){
			if (encounterID == this.encounter) { //we have a match...
				if(moment(encounterDate).isSame(this.open, 'day')){
					Dx = Dx +  '<span><span class="diagnosis">CC: ' + this.cc + '<br>Dx: ' + this.diagnosis + '</span></span>';
				}else {
					Dx = Dx +  '<span><span class="diagnosis">CC: ' + this.cc + '<br>Dx: ' + this.diagnosis + ' (' + moment(this.open).format('L') +')</span></span>';
				}
			}
			
			});
		var rendered = Mustache.render(template,
			{
			 encounterID:encounterID,
			 username:this.username,
			 subjective: this.subjective,
			 objective: this.objective,
			 assessment: this.assessment,
			 plan: this.plan,
			 date: moment(this.start).format('L'),
			 note:this.note,
			 diagnoses:Dx
			 });
		$('#timeline').append(rendered);
		});
	
		$('#label_encounter_saving').hide();
		$('#label_encounter_saving_error').hide();
		//hide the #tab_new_encounter tab
		$('#tab_new_encounter').hide();
		
    }
	
	function renderHistory(){
		var data,render;
		//get the templates
		var template_general_history = $('#tmpl_general_history').html();
		var template_general_history_pmh = $('#tmpl_general_history_pmh').html();
		var template_general_history_family_history = $('#tmpl_general_history_familyhistory').html();
		
		
		Mustache.parse(template_general_history);
		Mustache.parse(template_general_history_pmh);
		Mustache.parse(template_general_history_family_history);
	
		
		
		//render the general history tab
		log(oHistory.allergies);
		var general_history =  Mustache.render(template_general_history,
											   {allergies : oHistory.allergies});
		$('#general_history').html(general_history);
		
		//render the PMH
		if (oHistory.pmh !== '' ){
				data = {pmh:JSON.parse(oHistory.pmh)};
				render = Mustache.render(template_general_history_pmh,data);
				$('#general_history .pmh').html(render);
				render = Mustache.render(template_general_history_pmh,{pmh:[{"year":"","condition":""}]});
				$('#general_history .pmh').append(render);	
		} else {
				pmh = [{"year":"","condition":""}];
				render = Mustache.render(template_general_history_pmh,{pmh:[{"year":"","condition":""}]});
				$('#general_history .pmh').append(render);
			
		}
		
		//render the family history
		if (oHistory.family_history !== null ){
				data = {familyhistory:JSON.parse(oHistory.family_history)};
				render = Mustache.render(template_general_history_family_history,data);
				$('#general_history .familyhistory').html(render);
				render = Mustache.render(template_general_history_family_history,{familyhistory:[{"condition":"","relative":""}]});
				$('#general_history .familyhistory').append(render);	
		} else {
				//pmh = [{"year":"","condition":""}];
				render = Mustache.render(template_general_history_family_history,{familyhistory:[{"condition":"","relative":""}]});
				$('#general_history .familyhistory').append(render);
			
		}
		
		
		
		//paed history
		var template_paediatric_history = $('#tmpl_paediatric_history').html();
		var paediatric_history = Mustache.render(template_paediatric_history,
								{paed_place_of_birth : oHistory.paed_place_of_birth,
								paed_pregnancy_duration : oHistory.paed_pregnancy_duration,
								paed_duration_of_labour_stage1 : oHistory.paed_duration_of_labour_stage1,
								paed_duration_of_labour_stage2 : oHistory.paed_duration_of_labour_stage2,
								paed_ease_of_birth : oHistory.paed_ease_of_birth,
								paed_delivery_type : oHistory.paed_delivery_type,
								paed_interventions : oHistory.paed_interventions,
								paed_analgesia : oHistory.paed_analgesia,
								paed_birth_weight : oHistory.paed_birth_weight,
								paed_birth_height : oHistory.paed_birth_height,
								paed_head_circumference : oHistory.paed_head_circumference,
								paed_feeding_behaviour : oHistory.paed_feeding_behaviour,
								breastfeeding:function () {
									return function (text) {
									return text.replace('value="' + oHistory.paed_breast_feeding +'"', 'value="' + oHistory.paed_breast_feeding +'" checked');
										};
									},
								bottlefeeding:function () {
									return function (text) {
									return text.replace('value="' + oHistory.paed_bottle_feeding +'"', 'value="' + oHistory.paed_bottle_feeding +'" checked');
										};
									},
									
							    paed_crying_when : oHistory.paed_crying_when,
								paed_crying_type : oHistory.paed_crying_type,
								paed_crying_duration : oHistory.paed_crying_duration,
								paed_immunisations : oHistory.paed_immunisations,
								paed_sleeping_pattern : oHistory.paed_sleeping_pattern,
								paed_tummy_time : oHistory.paed_tummy_time
								
								});
		
		$('#paediatric_history').html(paediatric_history);
		$('.tagsinput').tagsinput();
		
		
		
		
	}
	
	$(document).on('change','.complaint .complaint_input',function(){
		var complaint_id = $(this).attr("complaint_id");
		var value = $(this).val();
		var field = $(this).attr("name");
		Complaint.save(complaint_id,field,value);
		log('COMPLAINT INPUT: ' + complaint_id + value + field);
		});
	
	
	//save the family history input on change
	$(document).on('change','.familyhistory input',function(){
		var array = [];
		$('.familyhistory li').each(function(){
			var condition = $(this).find('.condition').val();
			var relationship = $(this).find('.relationship').val();
			
			if (condition !== ''){ 
				array.push({
					condition: condition,
					relationship : relationship
				});
			}
		});
		
		var jsonString = JSON.stringify(array);
		//update the object and save to DB
		oHistory.family_history = jsonString;
		History.save(patientID,'family_history',jsonString);
		
	});
	
	
	
	//save the history input on change
	$(document).on('change','.history input',function(){
		var value = $(this).val();
		var field = $(this).attr("name");
		History.save(patientID,field,value,function(){oHistory[field] = value;});
		});
	
	
	//save the PMH data on change
	$(document).on('change','.pmh input',function(){
		var array = [];
		$('.pmh li').each(function(){
			var year = $(this).find('.year').val();
			var condition = $(this).find('.condition').val();
			var redflag,yellowflag ='';
			if($(this).find('.redflag').is(':checked')){redflag = true;}else{redflag=false;}
			if($(this).find('.yellowflag').is(':checked')){yellowflag = true;}else{yellowflag=false;}
			
			//if (year !== '' && condition !== ''){ 
			if (condition !== ''){ //this one only checks on condition so user can enter a PMH entry without year entry
				array.push({
					year: year,
					condition: condition,
					redflag: redflag,
					yellowflag : yellowflag
					
				});
			}
		});
		
		var jsonString = JSON.stringify(array);
		//update the object and save to DB
		oHistory.pmh = jsonString;
		History.save(patientID,'pmh',jsonString);
		
	});
	
	//inputs clone when full 
	$(document).on("keypress",".cloneWhenFull input",function(){
			var allHaveText;
			var parentNode = $(this).closest("ul");
			var nodeToClone = $(this).closest("li");
			emptyInputs=parentNode.find("input[type=text]").filter(function () {
            return !this.value;
			});                  
			if(emptyInputs.length==0)
			{
				newGroup = nodeToClone.clone().appendTo(parentNode); 
				newGroup.find("input[type=text]").each(function(){
					$(this).val("");
				});
			}
		
		});
	
	
	$(document).on('dblclick','#subjective,#objective,#assessment,#plan',function(){
		//$(this).val('terry');
		//oPrevEncounter.
		
		});
	
});




function saveNotes() 
{
	var notes = $('#thierry').html();
	var patient_id = $('#patient_id').val();
	
		$.ajax({
						url: "ajax.php",
						dataType: "html",
						type:"post",
						crossDomain: true,
						data: {
							notes: notes,
							patient_id: patient_id,
							com :"patient",
							task :"save_notes",
							ajax:true
							
						}
					})
					.then( function ( response ) {
						//$.each( response, function ( i, val ) {
						//	html += "<li>" + val + "</li>";
						// });
						console.log(response);
						//var n = noty({text: 'note saved...',type: 'success',layout:'topCenter'});
						alert('saved');
						
						//$ul.listview( "refresh" );
						//$ul.trigger( "updatelayout");
					});
	
}




