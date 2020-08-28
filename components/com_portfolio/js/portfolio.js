$(function() {
  var selectImageMode = false;
  var selectedImages = [];
  
  
  getPictureProofImages();
  getEducateImages();
  //hide some buttons
  $('.btnGeneratePDF').hide();
  $('.btnDeleteImages').hide();
  function getPictureProofImages() {
    log ('hello');
    $.ajax({type: "post", url: "ajax.php", dataType: "json",
      data: { com: 'pictureproof',task: 'getPortfolioImages', patientID : patientID}
        }).success(function(pictureproofImages) {
           $('#pictureproofImages').empty();
          log (pictureproofImages);
          
            $.each(pictureproofImages, function(){
                  
                  var div = $('<div>',{class:'col-sm-3 col-xs-6 thumbnail-container'}).html('<img class="img-thumbnail" id="'+ this.image_id +'" src="userdata/portfolio_images/'+ this.filename +'">');
                  $('#pictureproofImages').append(div);
                  
          });
            

      });
   
  }

  function getEducateImages() {
   
    $.ajax({type: "post", url: "ajax.php", dataType: "json",
      data: { com: 'educate',task: 'getPortfolioImages', patientID : patientID}
        }).success(function( educateImages ) {
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
          
          //selectedImages.push (e.target.id);
          selectedImages.push(image);
          log(selectedImages);
      } else {
          
          selectedImages = selectedImages.filter(function(item){
              return item !== e.target.id;
          });
          log(selectedImages);
      }

      //check if delete button has to be activated
      if (selectedImages.length > 0) {$('.btnDeleteImages').prop('disabled',false)}else{$('.btnDeleteImages').prop('disabled',true)};
      if (selectedImages.length > 0) {$('.btnGeneratePDF').prop('disabled',false)}else{$('.btnGeneratePDF').prop('disabled',true)};
  }
});

    $('.btnSelectImages').click(function() {
        if(!selectImageMode){ //start selecting images
            selectImageMode = true;
           $(this).html('cancel');
           $('.btnDeleteImages').show();
           $('.btnGeneratePDF').show();
           

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
        $('.btnGeneratePDF').hide();
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

    $('.btnGeneratePDF').click(function() {

     
      var doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
       });
       doc.page = 1
       
       var newY = 0;
       const pageHeight = doc.internal.pageSize.height;
       const pageWidth = doc.internal.pageSize.width;
       doc.setFont("helvetica");
       doc.setFontType("bold");
       //var img = new Image()
       //img.src = clinic.clinic_logo;
       //doc.addImage(img, 'png', 10, 78, 12, 15)
       function printHeader(){
        doc.setFontSize(18);
        doc.text(15, 15, clinic.clinic_name);
        doc.setFontType("normal");
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

       


       
       //var pdfBase64 = doc.output('datauristring');
       /* var pdfBase64 = doc.output('blob');
       $.ajax({
        url: "ajax.php",
        type: 'post',
        data: {
          com: 'portfolio',
          task: 'emailPortfolio',
          pdf: pdfBase64,
          clinic:clinic.clinic_id
        },
        success: function(data) {
         
          
        }
       }); */
       
      //doc.autoPrint();
      //doc.save('portfolio.pdf');
      window.open(doc.output('bloburl'), '_blank')
     
      


      

  });


    
});






