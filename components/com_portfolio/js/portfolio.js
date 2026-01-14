showLoadingScreen();

$(function() {
  var selectImageMode = false;
  var selectedImages = [];
  var doc;
  
  getPictureProofImages();
  getEducateImages();
  //hide some buttons
  $('.btnDeleteImages').hide();
  $('.actionButton').hide();
  function getPictureProofImages() {
    log ('hello');
    $.ajax({type: "post", url: "ajax.php", dataType: "json",
      data: { com: 'pictureproof',task: 'getPortfolioImages', patientID : patientID}
        }).done(function(pictureproofImages) {
           $('#pictureproofImages').empty();
          hideLoadingScreen();
          
            $.each(pictureproofImages, function(){
                  
                  var div = $('<div>',{class:'col-sm-3 col-xs-6 thumbnail-container'}).html('<img class="img-thumbnail" id="'+ this.image_id +'" src="userdata/portfolio_images/'+ this.filename +'">');
                  $('#pictureproofImages').append(div);
                  
          });
            

      });
   
  }

  function getEducateImages() {
   
    $.ajax({type: "post", url: "ajax.php", dataType: "json",
      data: { com: 'educate',task: 'getPortfolioImages', patientID : patientID}
        }).done(function( educateImages ) {
           $('#educateImages').empty();
        
            $.each(educateImages, function(){
                  
                  var div = $('<div>',{class:'col-sm-3 col-xs-6 thumbnail-container'}).html('<img class="img-thumbnail" id="'+ this.image_id +'" src="userdata/portfolio_images/'+ this.filename +'">');
                  $('#educateImages').append(div);
                  
          });
            

      });
   
 }

 $(document).on('click','.img-thumbnail',function(e) {            
  if (!selectImageMode){
      //show the image...
  } else {
      $(this).toggleClass('imageSelected');
      if($(this).hasClass('imageSelected')){
        var image = new Object();
          image.width = e.target.width;
          image.height = e.target.height;
          image.src = e.target.src;
          image.id = e.target.id;
          
          //selectedImages.push (e.target.id);
          selectedImages.push(image);
          log(selectedImages);
      } else {
          
          selectedImages = selectedImages.filter(function(item){
              return item.id !== e.target.id;
          });
          log(selectedImages);
      }

      //check if delete button has to be activated
      if (selectedImages.length > 0) {$('.btnDeleteImages').prop('disabled',false)}else{$('.btnDeleteImages').prop('disabled',true)};
      if (selectedImages.length > 0) {$('.actionButton').prop('disabled',false)}else{$('.actionButton').prop('disabled',true)};
  }
});

    $('.btnSelectImages').click(function() {
        if(!selectImageMode){ //start selecting images
            selectImageMode = true;
           $(this).html('cancel');
           $('.btnDeleteImages').show();
           $('.actionButton').show();
           

        } else { //cancel selecting
            cancelSelectingImages();

        }

    });

    function cancelSelectingImages(){
        selectImageMode = false;
        $('.btnSelectImages').html('select');
        $('.img-thumbnail').removeClass('imageSelected');
        selectedImages = [];
        $('.btnDeleteImages').prop('disabled',true)
        $('.btnDeleteImages').hide();
        $('.actionButton').hide();
        log (selectedImages);

    }
    
    $('.btnDeleteImages').click(function() {
        $.ajax({
            url: "ajax.php",
            type: 'post',
            data: {
              com: 'portfolio',
              task: 'deletePortfolioImages',
              images: JSON.stringify(selectedImages)
            },
            success: function(data) {
             getPictureProofImages();
             getEducateImages();
             cancelSelectingImages();
              
            }
           });
        



    });
    
    // ===== Helpers =====
function noty(type, text, timeout = 2000) {
  return new Noty({
    text: `<span class="text-center">${text}</span><span class="pull-right"><i class="fa fa-times-circle">&nbsp;</i></span>`,
    layout: 'topCenter',
    theme: 'sunset',
    type,
    timeout
  }).show();
}

function getJsPDFCtor() {
  if (window.jspdf && window.jspdf.jsPDF) return window.jspdf.jsPDF; // UMD build
  if (window.jsPDF) return window.jsPDF;                             // global build
  throw new Error('jsPDF not loaded');
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    // If images can be cross-origin, you may need this:
    // img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image: ' + src));
    img.src = src;
  });
}

// ===== Actions =====
$('.btnEmailPortfolio').on('click', async function (e) {
  e.preventDefault();

  const $btn = $(this).prop('disabled', true);

  try {
    noty('alert', 'Sending portfolio by email...');

    const doc = await generatePortfolioPDF();     // waits for images/pages to be added
    const pdfBlob = doc.output('blob');           // Option A: Blob upload

    const fd = new FormData();
    fd.append('com', 'portfolio');
    fd.append('task', 'emailPortfolio');
    fd.append('clinic', (clinic?.clinic_id ?? ''));
    fd.append('patientEmail', (patientEmail ?? ''));
    fd.append('patientName', (patientName ?? ''));
    fd.append('pdf', pdfBlob, 'portfolio.pdf');

    $.ajax({
      url: 'ajax.php',
      type: 'POST',
      data: fd,
      processData: false,
      contentType: false,
      success: function () {
        noty('success', 'Portfolio emailed!');
      },
      error: function (xhr) {
        noty('error', 'Email failed (' + xhr.status + '): ' + (xhr.responseText || ''));
      },
      complete: function () {
        $btn.prop('disabled', false);
      }
    });

  } catch (err) {
    console.error(err);
    $btn.prop('disabled', false);
    noty('error', 'PDF generation failed: ' + (err?.message || err), 4000);
  }
});

$('.btnPrintPortfolio').on('click', async function (e) {
  e.preventDefault();

  const $btn = $(this).prop('disabled', true);

  try {
    const doc = await generatePortfolioPDF();
    window.open(doc.output('bloburl'), '_blank');
  } catch (err) {
    console.error(err);
    noty('error', 'PDF generation failed: ' + (err?.message || err), 4000);
  } finally {
    $btn.prop('disabled', false);
  }
});

// ===== PDF builder (async + waits for images) =====
async function generatePortfolioPDF() {
  const jsPDF = getJsPDFCtor();

  const doc = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4'
  });

  let page = 1;
  let newY = 0;

  const pageHeight = doc.internal.pageSize.height;
  const pageWidth = doc.internal.pageSize.width;

  function printHeader() {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text(15, 15, (clinic?.clinic_name ?? '').toString());

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(15, 20, `${clinic?.clinic_street ?? ''} - ${clinic?.clinic_postcode ?? ''} ${clinic?.clinic_city ?? ''}`.trim());
    doc.text(15, 25, (clinic?.clinic_tel ?? '').toString());
    doc.text(15, 30, (clinic?.clinic_email ?? '').toString());
    doc.text(15, 35, (clinic?.clinic_web ?? '').toString());

    doc.setDrawColor(255, 0, 0);
    doc.line(15, 38, 195, 38);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(15, 45, `Patient: ${(patientName ?? '')} (${(patientDOB ?? '')})`);
    doc.text(15, 50, `Clinician: ${(clinician ?? '')}`);

    newY = 60;
  }

  function printFooter() {
    doc.text(pageWidth - 10, pageHeight - 10, 'p' + page);
  }

  function newPage() {
    if (page > 1) doc.addPage();
    printHeader();
    printFooter();
    page += 1;
  }

  newPage();

  // Ensure selectedImages exist
  const imgs = Array.isArray(selectedImages) ? selectedImages : [];

  for (const item of imgs) {
    const src = item?.src;
    if (!src) continue;

    // Load image fully (important!)
    const img = await loadImage(src);

    const imgWidth = 150; // mm
    const ratio = img.naturalHeight / img.naturalWidth;
    const imgHeight = Math.round(imgWidth * ratio);

    if (newY + imgHeight > (pageHeight - 15)) {
      newPage();
    }

    // If your images are JPG, change 'PNG' to 'JPEG'
    doc.addImage(img, 'PNG', 15, newY, imgWidth, imgHeight);
    newY += imgHeight + 10;
  }

  return doc;
}
    
});






