var oPatient;
var cast;
$(document).ready(function(){
	var fSOAPSaved = 1;
	var fSaveSuccess = 1;
	var fNewEncounter = false;
	var fAllSaved = 1;
	var oEncounter;
	var encounters;
	var oPrevEncounter;	
	var diagnoses;
	var filteredDiagnoses;
	var oHistory = null;
	var vitals = null;
	//var to store diagnosis form to input elements after diagnosis selection
	var formDiagnosis;
	
	//hide the page and set the loading
	var notys = []; //array that contains all the notyfications

	var editingSOAP = false ;

	var selectImageMode = false;
	var selectedImages = [];
	
	var canvasWidth=0;
	var canvasHeight=0;
	var maxWidth=1000;
	var bgImage;
	var bgImageCurAngle = 0;
	var saveNoty;

	cast = new Cast('https://desk.timegenics.com');

	
	
	showLoadingScreen();
	//set the page title = patientName
	
	document.title = patientName;
	//init the progress bar
	var patientPB = new NProgress({
		container:'#main_content',
		randomTrickle:true
	
	  });

	//append the modals to the body to avoid Z index probs
	$('#emailModal').appendTo("body");
	
	//set the Active patient
	window.addEventListener('focus', setActivePatient);
	setActivePatient();

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
              
            }
           });
          }



	//minify the main menu
	$('#main-menu-min').click ();
	
	//append modals to body to avoid bg issue
	$('#diagnosesModal').appendTo("body");
	renderMain();
	

	//prepare the canvas for the docs
	var canvas =  new fabric.Canvas('c', { isDrawingMode: false, backgroundColor :'white', selection: false,allowTouchScrolling: true,originX: 'center',
    originY: 'center'});
	canvas.setDimensions({width:canvasWidth, height:canvasHeight});
	
	function renderMain(){
		//$('#patientPB').html("getting <strong>" + patientName + "'s </strong> file...");
		patientPB.start();

		$.when(Patient.get(patientID),
			   History.get(patientID),
			   Encounter.getAll(patientID),
			   Diagnosis.getDiagnosesPatient(patientID),
			   Patient.getVitals(patientID),
			   ).then(function( data1,data2,data3,data4,data5 ) {
			
			oPatient = data1[0];
			oHistory = data2[0];
			encounters = data3[0];
			diagnoses = data4[0];
			vitals = data5[0];
			$('.left-content').show();
			
			renderDemographicsPanel();
			renderVitalsPanel(true);
			renderHistoryPanel();
			renderEncounters();
			renderSummary();
			renderInitComplaintTabs(false);
			renderComplaints(true);
			renderFlagnotifications();
			renderDocsPanel();
			renderPictureProofPanel();
			renderPatientAppointments();
			
			//assign previous encounter to var in order to use them in new encounter.. so user can copy this is new encounter
			oPrevEncounter = encounters[1];
			patientPB.done();
			disableform('editSOAP',false);
			hideLoadingScreen();
			
		});
	}
	
	
	
	
	//grab the encounter timeline template
	//Grab the inline template
	
	var template_complaint_tab = $('#tmpl_complaint_tab').html();
	var template_complaint = $('#tmpl_complaint').html();
	var template_complaint_init = $('#tmpl_complaint_init').html();
	var tmpl_patient_appointments = $('#tmpl_patient_appointments').html();
		
	
	
	//Parse it 
	
	Mustache.parse(template_complaint);
	Mustache.parse(template_complaint_tab);
	Mustache.parse(template_complaint_init);
	Mustache.parse(tmpl_patient_appointments);
	
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
	
	
	
	
	$(document).on('click','.bookAppointment', function(){
		
	});

	$(document).on('click','.encounter', function(){
		
		if (editingSOAP){return}

		editingSOAP = !editingSOAP;
		
		resetEncounter();
		var encounterID = $(this).attr('encounterID');
		oEncounter = encounters.find(x => x.id === encounterID);
		$('#Encounter_title').html('Encounter: ' +  moment(oEncounter.start).format('LLLL'));
		$('#SOAP_ID').val(oEncounter.soap_id);
		$('#subjective').val(oEncounter.subjective);
		$('#objective').val(oEncounter.objective);
		$('#assessment').val(oEncounter.assessment);
		$('#plan').val(oEncounter.plan);
		$('#interval').val(oEncounter.interval);
		$('#supp_measures').val(oEncounter.supp_measures);

		
		$('#encounter').show();
		$('#btn_new_encounter').hide();
		$(this).toggleClass("selected");
		
		
		
		
		//load the complaints
		renderInitComplaintTabs(true);
		renderVitalsPanel(false);
		renderComplaints(false);
		
		//load the history

		
	});
	

	$(document).on('click','#btn_new_encounter', function () {
		//toggle new encounter tab and create new encounter
		fNewEncounter = true;
		resetEncounter();	
		$('#encounter').show();
		$(this).hide();
		$('#Encounter_title').html('New Encounter');
		
		
		renderInitComplaintTabs(true);
		renderVitalsPanel(false);
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
				renderComplaints(false);
				//create New soap note and link to this encounter
				SOAP.add(
				   {
					encounter_id : oEncounter.id,
					patient_id: oEncounter.patient_id,
					user:oEncounter.user,
					created:oEncounter.start
					},function(SOAP){
						//log('the new SOAP ID : ' + SOAP.id);
						$('#SOAP_ID').val(SOAP.id);
						
					});
				//set the appointment status to 4 if there is an appointment linked to this encounter
				if (appointment_id != 'null'){
					//change status to in consultation -> status 4
					Appointment.setStatus(appointment_id, 4);
				}
			
			});

	});
	
	$(document).on('change','#editSOAP .soap_input',async function(){
		var soap_id = $('#SOAP_ID').val();
		var value = $(this).val();
		var field = $(this).attr("name");
		//fSOAPSaved = false;
		//let val = await SOAP.save(soap_id,field,value);
		//fSOAPSaved = true;

		//log(val + ' is the RESPONSE');
		//log('SOAP INPUT: ' + soap_id + value + field);
		});


	$(document).on('change','#editSOAP .form-control',function() {
		log('changed!!');
		//saveSOAP();
		fAllSaved = 0;
	});
	
	
	//reset the encounter so there is no old data from another encounter
	function resetEncounter(){
	
		$('#editSOAP').trigger("reset");
	}
	

	function saveDiagnosis(form){
			$('#label_encounter_saving_error').hide();
			$('#label_encounter_saved').hide();
			$('#label_encounter_saving').show();
            
			
			DiagnosisForm = form.serialize();
			//log(DiagnosisForm);
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
	

	
	
	 $(document).on('click','.btn_close_encounter', function(){
		setSaveStatus('saving');
		SOAPform = $('#editSOAP').serializeArray();
		disableform('editSOAP',true);
		
		log(SOAPform);
		    SOAP.update(SOAPform,async function(data){
				fSaveSuccess = data.success;
				fSOAPSaved = data.success;
				encounters = await Encounter.getAll(patientID);
				diagnoses = await Diagnosis.getDiagnosesPatient(patientID);
				vitals = await Patient.getVitals(patientID),
				renderEncounters();
				renderVitalsPanel(true);
				renderInitComplaintTabs(false);
				renderComplaints();
				renderVitalsPanel(true);
				setSaveStatus('saved');

				
				$('#btn_new_encounter').show();
				editingSOAP = false;
				//disable the add vitals button

				//set the appointment status to 5 if there is an appointment linked to this encounter
				log('enc ' + fNewEncounter);

				if (appointment_id != 'null' && fNewEncounter === true){
					//change status to in consultation -> status 4
					Appointment.setStatus(appointment_id, 5);
					fNewEncounter = false;
				}


			}); 
				
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
	 
	 
	
	$(document).on('click','.unknown-diagnosis',function(){ 
	 
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

	function filterComplaints(){
		diagnoses.reverse();
		// Array to keep track of duplicates
		var dups = [];
		filteredDiagnoses = diagnoses.filter(function(el) {
		 // If it is not a duplicate, return true
			if (dups.indexOf(el.complaint) == -1) {
				dups.push(el.complaint);
				return true;
			}
			return false;
		});
	}

	function renderComplaints(disabled){ //disabled is a flag (true/false) to be set to false when the user is in an encounter and true when no encounter is active, this to prevent edits in complaints when not in an encounter.
		//filter the duplicate complaints..complaints with more than 1 diagnosis
		
		filterComplaints();
		// if disabled = true the encounter_id in the template block should be empty or NULL 
		var encounter_id;
		if (disabled){ encounter_id = null} else {encounter_id = oEncounter.id};

		$.each(filteredDiagnoses,function(){
		    
			var pane_id = 'complaint_' + this.complaint;
				
							//render the complaint
							var rendered = Mustache.render(template_complaint,
								{complaint_id : this.complaint,
								 disabled : disabled,
								 patient_id: this.patient,
								 encounter_id : encounter_id,
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
								 open: moment(this.open).format('L'),
							
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
	
	
	function renderInitComplaintTabs(enabled){ //enabled is boolean flag to control whether the ADD COMPLAINT tab is visible.. should only be visble when in an active encounter
		var rendered = Mustache.render(template_complaint_init,
										{enabled:enabled});
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
	
	
	function renderDemographicsPanel(){
		
		var template_demographics_panel = $('#tpml_demographics_panel').html();
		Mustache.parse(template_demographics_panel);
		
		var dob = moment(oPatient.dob,'YYYY-MM-DD').format('L');
		var age = moment().diff(oPatient.dob, 'years',false); //false gives a non fraction value

		var address = oPatient.address + ' - ' + oPatient.postcode + ' ' + oPatient.city + ' - ' + oPatient.country ;
		
		var data = {patient_name : oPatient.patient_surname + ' ' + oPatient.patient_firstname ,
					dob: dob,
					age : age,
					sex : oPatient.sex,
					profession : oPatient.profession,
					insurance : oPatient.insurance,
					practitioner : oPatient.practitioner_name,
					phone : oPatient.phone,
					email : oPatient.email,
					address : address,
					redflags : JSON.parse(oHistory.pmh),
					yellowflags: JSON.parse(oHistory.pmh)
					};
		var demographics_panel = Mustache.render(template_demographics_panel,data);
		$('#demographics').html(demographics_panel);

	}
	//VITALS//
	function renderVitalsPanel(disabled){
		var template_vitals_panel = $('#tpml_vitals_panel').html();
		//convert the ISO datetime from db into local datetime
		
		$.each(vitals, function( ) {
  			this.timestamp_modified = moment(this.timestamp).format('lll');
		    
		});
		//log(JSON.stringify(vitals));


		Mustache.parse(template_vitals_panel);
			data = {
				disabled:disabled,
				patient_id:oPatient.patient_id,
				vitals:vitals};
			var vitals_panel = Mustache.render(template_vitals_panel,data);
		$('#vitals').html(vitals_panel);
		log('redering the vitals : ' + disabled);
		
		
	}

	$(document).on('change','.vitals_weight, .vitals_height',function() {
		if($(this).val() != ''){
			//calculate BMI
			height = ($('.vitals_height').val())/100;
			weight = $('.vitals_weight').val()
			bmi = weight /Math.pow(height,2);
			bmi = bmi.toFixed(2);
			$('.vitals_bmi').val(bmi);
			
		}
	});

	$(document).on('submit','#form-vitals', function(e){
		e.preventDefault();
		//set some extra values
		//$('.vitals_timestamp').val( moment().format("YYYY-MM-DD HH:mm:ss").toString());
		$('.vitals_timestamp').val( moment().format("YYYY-MM-DD HH:mm:ss"));
		$('.vitals_encounter_id').val( oEncounter.id);
		
		$('.vitals_bmi').prop('disabled',false); //if disabled the BMI is no accessible
		
		
		//form = ($(this).serializeArray());
		form = $('#form-vitals').serializeArray();
		log('form-->blabl ' + JSON.stringify(form));
		$('.btn_add_vitals').text('saving...');
		$('.btn_add_vitals').prop('disabled',true);
		$('.vitals_bmi').prop('disabled',true);

		Patient.addVitals(form,function(){
			$.when(Patient.getVitals(patientID).then(function(data){
				
				vitals = data;
				renderVitalsPanel();
				$('.btn_add_vitals').text('add Vitals');
				$('.btn_add_vitals').prop('disabled',false);
			}
			))
		}
		);
		
		

	});



	//VITALS//


	function renderSummary(){
		bogus = oHistory;
		filterComplaints();
		var template_summary = $('#tmpl_summary').html();
		Mustache.parse(template_summary);
		var rendered = Mustache.render(template_summary,
			{
				sport : oHistory.sport,
				profession : oHistory.profession,
				retired : oHistory.retired,
				drinking : oHistory.drinking,
				smoking : oHistory.smoking,
				sleeping : oHistory.sleeping,
				orthotics : oHistory.orthotics,
				heel_lift : oHistory.heel_lift,
				pmh : JSON.parse(oHistory.pmh),
				allergies : oHistory.allergies,
				complaints : function(){
					$.each(filteredDiagnoses,function(){
						this.open = moment(this.open).format('L')

					})
					return filteredDiagnoses;},
				bmi : ''
				
					
			
				

			 });
		$('#summary-panel .panel-body').html(rendered);
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
						layout:'center',
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
						layout:'center',
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
		var complaintID;
		var Dx;
		//var complaint = null;
		$.each(encounters, function() {
			Dx = '';

			encounterID = this.id;
			encounterDate = this.start;
		$.each(diagnoses,function(){
			if (encounterID == this.encounter) { //we have a match...
				complaintID = this.complaint;
				if(moment(encounterDate).isSame(this.open, 'day')){
					
					Dx = Dx +  '<span><span class="diagnosis" complaint="'+ this.complaint + '">CC: ' + this.cc + '<br>Dx: ' + this.diagnosis + '</span></span>';
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
			 interval:this.interval,
			 diagnoses:Dx,
			 complaintID:complaintID
			 });
		$('#encounters_table tbody').append(rendered);
		});
	
		$('#label_encounter_saving').hide();
		$('#label_encounter_saving_error').hide();
		//hide the #tab_new_encounter tab
		$('#tab_new_encounter').hide();
		
	}
	//DOCS
	$('.btnRefreshDocs').click(function(){
		renderDocsPanel();
	});
	function renderDocsPanel(){
		$('.btnDeleteDocs').hide();
		$('#canvasPanel').hide();
		$('#docsPanel').html('Loading documents...');
		$.ajax({type: "post", url: "ajax.php", dataType: "json",
          data: { com: 'patient',task: 'getDocuments', patientID : patientID}
            }).success(function( docs ) {
               $('#docsPanel').empty();
				console.log(docs);
				$('.docCount').html('(' + docs.length + ')');
				if(docs.length>0){$('.btnSelectDocs').show()}else{$('.btnSelectDocs').hide()}
                $.each(docs, function(){
                      console.log(this.filename);
                      var div = $('<div>',{class:'col-sm-3 col-xs-6 thumbnail-container'}).html('<img class="img-thumbnail" id="'+ this.image_id +'" src="userdata/camera_pictures/'+ this.filename +'">');
                      $('#docsPanel').append(div);
                      
	            });
                
		
	        });
	}

	function renderPictureProofPanel(){
		//$('.btnDeleteDocs').hide();
		//$('#canvasPanel').hide();
		//$('#docsPanel').html('Loading documents...');
		$.ajax({type: "post", url: "ajax.php", dataType: "json",
          data: { com: 'pictureproof',task: 'getPictureProofSavedPictures', patientID : patientID}
            }).success(function( pictures ) {
               $('#pictureproof-panel .panel-body').empty();
				console.log(pictures);
				$('.pictureProofCount').html('(' + pictures.length + ')');
				//if(pictures.length>0){$('.btnSelectDocs').show()}else{$('.btnSelectDocs').hide()}
                $.each(pictures, function(){
                      console.log(this.filename);
                      var div = $('<div>',{class:'col-sm-4 col-xs-6 thumbnail-container'}).html('<img class="img-thumbnail" id="'+ this.image_id +'" src="userdata/portfolio_images/'+ this.filename +'">');
                      $('#pictureproof-panel .panel-body').append(div);
                      
	            });
                
		
	        });
	}

	$(document).on('click','.img-thumbnail',function(e) {            
        if (!selectImageMode){
            renderBackgroundImage(this.src);
			$('#canvasPanel').show();
            $( "#docsPanel" ).hide();
        } else {
            $(this).toggleClass('imageSelected');
            if($(this).hasClass('imageSelected')){
                selectedImages.push (e.target.id);
                log(selectedImages);
            } else {
                
                selectedImages = selectedImages.filter(function(item){
                    return item !== e.target.id;
                });
                log(selectedImages);
            }

            //check if delete button has to be activated
            if (selectedImages.length > 0) {$('.btnDeleteDocs').prop('disabled',false)}else{$('.btnDeleteDocs').prop('disabled',true)};
        }
    });

	$('.btnSelectDocs').click(function() {
        if(!selectImageMode){ //start selecting images
            selectImageMode = true;
           $(this).html('cancel');
           $('.btnDeleteDocs').show();

        } else { //cancel selecting
            cancelSelectingImages();

        }

    });

    function cancelSelectingImages(){
        selectImageMode = false;
        $('.btnSelectDocs').html('select');
        $('.img-thumbnail').removeClass('imageSelected');
        selectedImages = [];
        $('.btnDeleteDocs').prop('disabled',true)
        $('.btnDeleteDocs').hide();
        log (selectedImages);

    }
    
    $('.btnDeleteDocs').click(function() {
        $.ajax({
            url: "ajax.php",
            type: 'post',
            data: {
              com: 'pictureproof',
              task: 'deleteImages',
              images: JSON.stringify(selectedImages)
            },
            success: function(data) {
             renderDocsPanel();
              cancelSelectingImages();
            }
           });
        



	});
	
	

	function renderBackgroundImage(source){
    
		fabric.Image.fromURL(source, function (img) {
			 
			 imgWidth = img.width;
			   imgHeight = img.height;
			 aspectRatio = imgHeight/imgWidth;
			 canvasWidth = maxWidth;
			 
			 canvasHeight = maxWidth * aspectRatio;
			 var scaleFactor = canvasWidth / imgWidth;
	
				 img.set({
					 width: imgWidth, 
					 height: imgHeight, 
					 originX: 'left', 
					 originY: 'top',
					 scaleX: scaleFactor,
					 scaleY: scaleFactor,
					 
				 });
				 canvas.setWidth(canvasWidth);
				 canvas.setHeight(canvasHeight);
				 canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
				 bgImage = img;
			 });
	}
	$('#btnRotatePlus90').click(function() {
		


		log (canvas.backgroundImage.width + ' is the width;');
		canvas.setWidth(canvas.backgroundImage.height);
        canvas.setHeight(canvas.backgroundImage.width);
        canvasHeight = canvas.getHeight();
        canvasWidth = canvas.getWidth();
        rotateObject(bgImage,bgImageCurAngle + 1.5708,bgImage.width/2,bgImage.height/2);
        bgImageCurAngle += 1.5708;  
        
        
        canvas.renderAll();
	});



	
	function rotateObject(fabObj, angleRadian, pivotX, pivotY) {
		ty = pivotY - fabObj.height / 2.0;
		tx = pivotX - fabObj.width / 2.0;
		if (angleRadian >= Math.PI * 2) {
			angleRadian -= Math.PI * 2;
		}
		angle2 = Math.atan2(ty, tx);
		angle3 = (2 * angle2 + angleRadian - Math.PI) / 2.0;
		pdist_sq = tx * tx + ty * ty;
		disp = Math.sqrt(2 * pdist_sq * (1 - Math.cos(angleRadian)));
		fabObj.set({transformMatrix:[
			Math.cos(angleRadian),
			Math.sin(angleRadian),
		   -Math.sin(angleRadian),
			Math.cos(angleRadian),
			disp * Math.cos(angle3),
			disp * Math.sin(angle3)
		]});
		}

		$('#btnSaveDoc').click(function(){ 
			//bottomBar.setVisible(false);topBar.setVisible(false);
			var dataURL = $('#c').get(0).toDataURL('image/jpeg');//have to get the canvas element from the jquery object
			//bottomBar.setVisible(true);topBar.setVisible(true);
			//log(dataURL);
			log(oPatient);
			 console.log(patientName);
			 $.ajax({
				   type: "post",
				 url: "ajax.php",
				   data: { com: 'patient', 
						   task: 'saveDoc', 
						   imgBase64: dataURL,
						 patientID: oPatient.patient_id}
				 }).success(function( response ) {
						 //add the image to the portfolio 
						 //renderDocsPanel();
						 console.log('image_added');
						 fcMessage = new Noty({
							text: '<span class="text-center">Saved to new document...</span><span class="pull-right"><i class="fa fa-times-circle">&nbsp;</i></span>',
							//closeWith:'click',
							layout:'top',
							theme:'sunset',
							type:'information',
							timeout: 3000
							}).show();				
				 });
			 });
	
			$('#btnCloseDoc').click(function(){
				$('#canvasPanel').hide();
				$('#docsPanel').show();
				renderDocsPanel();
			});
	//DOCS
	
	function renderHistoryPanel(){
		var data,render;
		//get the templates
		var template_general_history = $('#tmpl_general_history').html();
		var template_general_history_pmh = $('#tmpl_general_history_pmh').html();
		var template_general_history_family_history = $('#tmpl_general_history_familyhistory').html();
		
		
		Mustache.parse(template_general_history);
		Mustache.parse(template_general_history_pmh);
		Mustache.parse(template_general_history_family_history);
	
		
		
		//render the general history tab
		
		var general_history =  Mustache.render(template_general_history,
											   {allergies : oHistory.allergies,
												orthotics : oHistory.orthotics,
												heel_lift : oHistory.heel_lift
												});
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
		
		//social history
		var template_social_history = $('#tmpl_social_history').html();
		var social_history = Mustache.render(template_social_history,
			{sport : oHistory.sport,
			profession : oHistory.profession,
			retired : oHistory.retired,
			drinking : oHistory.drinking,
			smoking : oHistory.smoking,
			sleeping : oHistory.sleeping
			});
		$('#social_history').html(social_history);
		
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
	

	$(document).on('click','.complaint .btn_delete_complaint',function(){
		var complaint_id = $(this).attr("complaint_id");
		showConfirm('Are you sure you want to delete the complaint').then(function(result){
			if(result){
				Complaint.delete(complaint_id,async function(){
					diagnoses = await Diagnosis.getDiagnosesPatient(patientID);
					//renderComplaints(true);
					//renderMain();
					$tab_id = '#tab_complaint_' + complaint_id;
					$pane_id = '#complaint_' + complaint_id;
					$($tab_id).remove();
					$($pane_id).remove();
					
		
					log($('#complaints_tabs ul li').length);
					if ( $('#complaints_tabs .complaint_tab').length>0 ) {
						$("#complaints_tabs .complaint_tab a").first().click()
					}
					renderEncounters();
		
				});

			}
			
		  }); 
		
		


	});

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
		var type = $(this).attr("type");
		if (type == "checkbox") {
			if ($(this).is(":checked")) {
				value = 1;
			  } else {
				value = 0;
			  }
			  log('value checkbox -->' + value);
		}

		History.save(patientID,field,value,function(){oHistory[field] = value;renderSummary();});
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
		
		History.save(patientID,'pmh',jsonString,function(){
			oHistory.pmh = jsonString;
			renderDemographicsPanel();
		});

		
	});

	
	//inputs clone when full 
	$(document).on("keypress",".cloneWhenFull",function(){
			log('fjsdklfjsd');
			var parentNode = $(this).closest("ul");
			log (parentNode);
			var nodeToClone = $(this).closest("li");
			emptyInputs=parentNode.find(".cloneWhenFull").filter(function () {
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

	$(document).on('click','.list-encounters .complaint',function(){
			//open complaints tab en activate the right complaint
			var complaintID = $(this).data('complaint-id');
			$('.nav-tabs a[href="#complaints"]').tab('show');
			$('.nav-tabs a[href="#complaint_' + complaintID +'"]').tab('show');

			
	});
	//show appointments
	function renderPatientAppointments(){
		
		var futureAppointments, lastAppointment
		$.when(
		  Appointment.getFutureAppointments(patientID,function(appointments){futureAppointments = appointments}),
		  Appointment.getLastAppointment(patientID,function(appointment){lastAppointment = appointment})
	  
		
		).then(function() {
		  var title_future_appointments = 'Next Appointment';
		  var title_last_appointment = 'Last Appointment';
		  if (futureAppointments.length > 1){title_future_appointments = 'Next Appointments'};
		  if (futureAppointments.length < 1){title_future_appointments = 'No future appointments'};
		  if (lastAppointment.length <1 ){title_last_appointment = "No last appointment"}
	  
			var rendered = Mustache.render(tmpl_patient_appointments,
				{ title_future_appointments:title_future_appointments,
				  title_last_appointment: title_last_appointment,
				  future_appointments : futureAppointments,
				  last_appointment : lastAppointment
				});
			$('#patient_appointments').html(rendered);  
		
		});
		
	  
	  }

	 

	$(document).on('click','.btn_delete_encounter',function(){ 
		showConfirm('Are you sure you want to delete the encounter and all data associated wiht this encounter?').then(function(result){
			if(result){
				Encounter.delete(oEncounter.id,async function(){
					$('.btn_close_encounter').click();
				});

			}
			
		  }); 
	 });

	$(document).on('click','.btn_print_encounter',function(){
		//log(vitals);
		var template_encounter_print = $('#tmpl_encounter_print').html();
		Mustache.parse(template_encounter_print);

		var encounterPrint = Mustache.render(template_encounter_print,
		{patient_name : oPatient.patient_surname + ' ' + oPatient.patient_firstname,
		 practitioner:oPatient.practitioner_name,
		 dob:moment(oPatient.dob).format('l'),
		 vitals:vitals[0],
		 pmh:JSON.parse(oHistory.pmh),
		 complaints : filteredDiagnoses
		
		}
		)

		$("body").append("<div id='encounter_print'></div>");

		$('#encounter_print').html(encounterPrint);
		$('#encounter_print').printThis({
			printDelay: 500
			
		});
		$('#encounter_print').remove();


	});

	function disableform(formId, yesNo) {
		var f = document.getElementById(formId), s, opacity;
		s = f.style;
		opacity = yesNo? '40' : '100';
		s.opacity = s.MozOpacity = s.KhtmlOpacity = opacity/100;
		s.filter = 'alpha(opacity='+opacity+')';
		for(var i=0; i<f.length; i++) f[i].disabled = yesNo;
	 }
	
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




