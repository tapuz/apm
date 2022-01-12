window.jsPDF = window.jspdf.jsPDF;
$(function() {
	
    var options = {
		modules: {
		  toolbar: '#toolbar'
		},
		placeholder: 'Type letter or load a template from the right sidebar...',
		theme: 'snow'
	  };
	  var editor = new Quill('#editor', options);
	  try{
	  editor.setContents(JSON.parse(letter.letter));
	  } catch (error) {

	  }
	 
	
	$('.saveLetter').click(function(){
		setSaveStatus('saving');
		var letter_id = $('#letter_id').val();
		var letter = JSON.stringify(editor.getContents());
		var patient_id = $("#patient_id").val();
		var user_id = $("#user_id").val();
		var letter_name = $("#name").val();
		var note = $("#note").val();
		var clinic_id = $("#clinic option:selected").attr('clinic_id');

		$.ajax({
			type: "post",
		  	url: "ajax.php",
			data: { com:'letter',
					task:'save_letter',
					letter_id: letter_id,
					letter: letter, 
					name:letter_name, 
					note:note, 
					clinic_id:clinic_id 
					
					}
		  }).done(function( response ) {
			  setSaveStatus('saved');
				
		  });

  });
    
   
    
   $('.print').click(async function(){
   	var html = editor.root.innerHTML;
   	log('starting');
  	let PDF = await generatePDF(html);
  	
  	//log('terry: ' + terry);
  	window.open(PDF.output('bloburl'), '_blank');
   });
  
	
  $('.email').click(async function(){
	var patientEmail = $("#email_address").val();
	if($("#name").val()==""){
		new Noty({
			text: '<span class="text-center">Need a letter name to send email...</span><span class="pull-right"><i class="fa fa-times-circle">&nbsp;</i></span>',
			//closeWith:'click',
			layout:'topCenter',
			theme:'sunset',
			type:'error',
			timeout : '2000'
			}).show();
		return;
	} 
	if(patientEmail==""){
		new Noty({
			text: '<span class="text-center">There is no email address for this patient...</span><span class="pull-right"><i class="fa fa-times-circle">&nbsp;</i></span>',
			//closeWith:'click',
			layout:'topCenter',
			theme:'sunset',
			type:'error',
			timeout : '2000'
			}).show();
		return;
	} 
    var html = editor.root.innerHTML;
    var clinic_id = $("#clinic option:selected").attr('clinic_id');
	var subject = $("#name").val();
	
    
    var message = new Noty({
        text: '<span class="text-center">Sending letter by email...</span><span class="pull-right"><i class="fa fa-times-circle">&nbsp;</i></span>',
        //closeWith:'click',
        layout:'topCenter',
        theme:'sunset',
        type:'alert',
        timeout : '2000'
        }).show();
    let PDF = await generatePDF(html);
    
      var pdfBase64 = btoa(PDF.output());
      $.ajax({
       url: "ajax.php",
       type: 'post',
       data: {
         com: 'letter',
         task: 'emailLetter',
         pdf: pdfBase64,
         clinic:clinic_id,
         patientEmail:patientEmail,
         patientName:patientName,
		 subject:subject

       },
       success: function(data) {
        var message = new Noty({
          text: '<span class="text-center">'+data+'</span><span class="pull-right"><i class="fa fa-times-circle">&nbsp;</i></span>',
          //closeWith:'click',
          layout:'topCenter',
          theme:'sunset',
          type:'success',
          timeout : '2000'
          }).show();
         
       }
      });

  });

	  
async function generatePDF(html)
  {
  	var doc;
  	
		clinic_id = $('#clinic').val();
		var oClinic = clinicsJSON.find(x => x.clinic_id === clinic_id.toString());
		//log(oClinic);
	  

	 doc =  new jsPDF('p', 'px', 'a4', true);
   
     const pageHeight = doc.internal.pageSize.height;
     const pageWidth = doc.internal.pageSize.width;

	 

	
		doc.setFontSize(18);
		doc.text(25, 30, oClinic.clinic_name);
		doc.setFont("helvetica","", "normal");
		doc.setFontSize(12);
		doc.text(25, 50, oClinic.clinic_street + ' - ' + oClinic.clinic_postcode + ' ' + oClinic.clinic_city);
		doc.text(25, 60, oClinic.clinic_tel);
		doc.text(25, 70, oClinic.clinic_email);
		doc.text(25, 80, oClinic.clinic_web);
  
		doc.setDrawColor(255, 0, 0);
		doc.line(25, 90, pageWidth-15, 90);		
		newY = 80
	   

	//printHeader();

	const divWidth = pageWidth-35;
	
	
	const css = "<head><style>p{margin-bottom:-.2em;}</style></head>";

	
	html =  "<div style='line-height:normal;font-size: 10px;width:"+divWidth+"px'>" + html + "</div>"; 
	var $html = $(html);
	$html.find( "p" ).each( function(){
		
		$(this).css('margin-bottom','-.2em');
	});
	
	//log ('here: ' + $html[0].outerHTML);
	html = $html[0].outerHTML;
		
		let tom = await doc.html(html, {
			callback:async function(){
				const numberOfPages = doc.getNumberOfPages();
    
				for (let i = 1; i <= numberOfPages; i++) {
				doc.setPage(i);
				doc.text(pageWidth-30,pageHeight-10, 'p'+i);
				}
				

			},
			margin: [20, 0, 20, 0],
			autoPaging: "text",
			x: 25,
			y: 85
		});
		
   return doc;
  }
    

    
	$( ".delete_letter" ).click(function() {
		var letter_id = $(this).attr( 'letter_id' ); // get the letter id
							
		bootbox.confirm("Are you sure?", function(result) {
		if (result === true) // delete the letter from db
		{
			console.log('confirmed...');
										
			$.ajax({
  			type: "post",
		    url: "ajax.php",
  			data: { com: 'letter', 
  					task: 'delete_letter', 
  					letter_id: letter_id}
			}).success(function( response ) {
				console.log(response);
				
					var n = noty({text: 'Letter Deleted',type: 'success',layout:'topCenter'});
					$('#'+letter_id).remove();
				
			
				
  				
			});
		}
			
		}); 


	});
    
    $(".load_template").click(function() {
        var template_id = $(this).attr('template_id'); 
        var patient_id = $("#patient_id").val();
        var clinic_id = $("#clinic option:selected").attr('clinic_id');
        bootbox.confirm("Load new template?", function(result) {
        if (result) {
            //load the template
            $.ajax({
  			type: "post",
		    url: "ajax.php",
  			data: { com: 'letter', 
  					task: 'load_template', 
  					id:template_id,
                    patient_id:patient_id,
                    clinic_id:clinic_id}
			}).done(function( response ) {
				editor.setContents(JSON.parse(response));
			
				
  				
			});
            
        }
        
       
        }); 
    });
    

});





    

