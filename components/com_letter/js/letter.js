//window.jsPDF = window.jspdf.jsPDF;
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
  
	
  $('.email').on('click', async function (e) {
  e.preventDefault();

  const $btn = $(this);
  const patientEmail = ($('#email_address').val() || '').trim();
  const subject = ($('#name').val() || '').trim();

  if (!subject) {
    new Noty({ text: 'Need a letter name to send email...', layout:'topCenter', theme:'sunset', type:'error', timeout:2000 }).show();
    return;
  }
  if (!patientEmail) {
    new Noty({ text: 'There is no email address for this patient...', layout:'topCenter', theme:'sunset', type:'error', timeout:2000 }).show();
    return;
  }

  const html = editor?.root?.innerHTML || '';
  const clinic_id = ($('#clinic').val() || '').toString();
  const email_message = ($('#email_message').val() || '').toString().replace(/\r?\n/g, '<br />');

  $btn.prop('disabled', true);

  new Noty({ text:'Sending letter by email...', layout:'topCenter', theme:'sunset', type:'alert', timeout:2000 }).show();

  try {
    const doc = await generatePDF(html);              // waits until html() is done
    const pdfBlob = doc.output('blob');               // Blob (Option A)

    const fd = new FormData();
    fd.append('com', 'letter');
    fd.append('task', 'emailLetter');
    fd.append('clinic', clinic_id);
    fd.append('patientEmail', patientEmail);
    fd.append('patientName', (typeof patientName !== 'undefined' ? patientName : ''));
    fd.append('subject', subject);
    fd.append('message', email_message);
    fd.append('pdf', pdfBlob, 'letter.pdf');

    $.ajax({
      url: 'ajax.php',
      method: 'POST',
      data: fd,
      processData: false,
      contentType: false,
      success: function (data) {
        new Noty({ text: 'Letter Emailed!', layout:'topCenter', theme:'sunset', type:'success', timeout:2000 }).show();
      },
      error: function (xhr) {
        new Noty({ text: 'Server error (' + xhr.status + '): ' + (xhr.responseText || ''), layout:'topCenter', theme:'sunset', type:'error', timeout:4000 }).show();
      },
      complete: function () {
        $btn.prop('disabled', false);
      }
    });

  } catch (err) {
    console.error(err);
    $btn.prop('disabled', false);
    new Noty({ text: 'PDF generation failed: ' + (err?.message || err), layout:'topCenter', theme:'sunset', type:'error', timeout:4000 }).show();
  }
});

function getJsPDFCtor() {
  // UMD build (jspdf.umd.min.js)
  if (window.jspdf && window.jspdf.jsPDF) return window.jspdf.jsPDF;

  // Global build (older / different bundle)
  if (window.jsPDF) return window.jsPDF;

  throw new Error('jsPDF not found. Ensure jsPDF is loaded before this script.');
}

async function generatePDF(html) {
  const jsPDF = getJsPDFCtor();

  const clinic_id = ($('#clinic').val() || '').toString();
  const oClinic = (clinicsJSON || []).find(x => x.clinic_id === clinic_id) || {};

  const doc = new jsPDF('p', 'px', 'a4', true);

  const pageHeight = doc.internal.pageSize.height;
  const pageWidth  = doc.internal.pageSize.width;

  // Header
  doc.setFontSize(18);
  doc.text(25, 30, (oClinic.clinic_name || '').toString());
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.text(25, 50, `${oClinic.clinic_street || ''} - ${oClinic.clinic_postcode || ''} ${oClinic.clinic_city || ''}`.trim());
  doc.text(25, 60, (oClinic.clinic_tel || '').toString());
  doc.text(25, 70, (oClinic.clinic_email || '').toString());
  doc.text(25, 80, (oClinic.clinic_web || '').toString());
  doc.setDrawColor(255, 0, 0);
  doc.line(25, 90, pageWidth - 15, 90);

  // HTML
  const divWidth = pageWidth - 35;
  let wrapped = `<div style="line-height:normal;font-size:10px;width:${divWidth}px">${html}</div>`;
  const $html = $(wrapped);
  $html.find('p').css('margin-bottom', '-.2em');
  wrapped = $html[0].outerHTML;

  // IMPORTANT: wait for html() to finish
  await new Promise((resolve, reject) => {
    doc.html(wrapped, {
      x: 25,
      y: 85,
      margin: [20, 0, 20, 0],
      autoPaging: 'text',
      callback: function (pdf) {
        try {
          const n = pdf.getNumberOfPages();
          for (let i = 1; i <= n; i++) {
            pdf.setPage(i);
            pdf.text(pageWidth - 30, pageHeight - 10, 'p' + i);
          }
          resolve();
        } catch (e) {
          reject(e);
        }
      }
    });
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





    

