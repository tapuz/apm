showLoadingScreen();
window.jsPDF = window.jspdf.jsPDF;
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
    
    $('.btnEmailPortfolio').click(function(){
      generatePDF();
      var message = new Noty({
        text: '<span class="text-center">Sending portfolio by email...</span><span class="pull-right"><i class="fa fa-times-circle">&nbsp;</i></span>',
        //closeWith:'click',
        layout:'topCenter',
        theme:'sunset',
        type:'alert',
        timeout : '2000'
        }).show();

    log(patientEmail);
      var pdfBase64 = btoa(doc.output());
      $.ajax({
       url: "ajax.php",
       type: 'post',
       data: {
         com: 'portfolio',
         task: 'emailPortfolio',
         pdf: pdfBase64,
         clinic:clinic.clinic_id,
         patientEmail:patientEmail,
         patientName:patientName

       },
       success: function(data) {
        var message = new Noty({
          text: '<span class="text-center">Portfolio emailed!</span><span class="pull-right"><i class="fa fa-times-circle">&nbsp;</i></span>',
          //closeWith:'click',
          layout:'topCenter',
          theme:'sunset',
          type:'success',
          timeout : '2000'
          }).show();
         
       }
      }); 
    });

    $('.btnPrintPortfolio').click(function() {
      generatePDF();
      window.open(doc.output('bloburl'), '_blank');

  });

  function generatePDF()
  {
    doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4'
     });
     doc.page = 1
     
     var newY = 0;
     const pageHeight = doc.internal.pageSize.height;
     const pageWidth = doc.internal.pageSize.width;
     doc.setFont("helvetica","", "bold");
     
     //var img = new Image()
     //img.src = clinic.clinic_logo;
     //doc.addImage(img, 'png', 10, 78, 12, 15)
     function printHeader(){
      doc.setFontSize(18);
      doc.text(15, 15, clinic.clinic_name);
      doc.setFont("helvetica","", "normal");
      doc.setFontSize(12);
      doc.text(15, 20, clinic.clinic_street + ' - ' + clinic.clinic_postcode + ' ' + clinic.clinic_city);
      doc.text(15, 25, clinic.clinic_tel);
      doc.text(15, 30, clinic.clinic_email);
      doc.text(15, 35, clinic.clinic_web);

      doc.setDrawColor(255, 0, 0);
      doc.line(15, 38, 195, 38);

      //doc.setFontType("bold");
      doc.setFontSize(12);
      doc.text(15, 45, 'Patient: ' + patientName + ' (' + patientDOB + ')');
      doc.text(15, 50, 'Clinician: ' + clinician);

      
      
      newY = 60
     }
     function Printfooter(){
      doc.text(pageWidth-10,pageHeight-10, 'p'+doc.page);
      doc.page ++;
      };
     printHeader();
     Printfooter();
     

     
   
     $.each(selectedImages, function(){
      var imgWidth = 150;
      var imgHeight=0;
      var ratio = 0;
      var img = new Image()
      img.src = this.src;
      //calc ratio
      ratio = (this.height/this.width).toFixed(3);
      imgHeight = Math.round(imgWidth*ratio)
      if (newY + imgHeight > pageHeight){ doc.addPage();printHeader();Printfooter();}
      doc.addImage(img, 'png', 15, newY , imgWidth,imgHeight);
      newY = newY + imgHeight + 10;
      
     });


  }
    
});






