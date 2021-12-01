$(document).ready(function(){

    var tmpl_payment_summary = $('#tmpl_payment_summary').html();
	Mustache.parse(tmpl_payment_summary);	
	
	$('.date-picker').datepicker({ dateFormat: 'dd/mm/yy' });
	
    $('#date').val(moment().format('l'));
	//Parse it 
	
	
    $('.btn_load_summary').click(function(){
       
       clinic = $("#clinic").val();
       practitioner =$("#practitioner").val();
       date= $('#date').val();


       $.ajax({
        url: "ajax.php",
        dataType: "json",
        type: 'post',
        data: {
        com: 'payment',
        task: 'getpaymentsummary',
        practitioner:practitioner,
        clinic:clinic,
        date:date
        //date:
        },
        success: function(data) {
        	if (Object.keys(data).length==0){ 
        		var summary='<div class="alert alert-danger" role="alert">No payments for this date...</div>';
        		
        	}else {
        		
            total=data.pop();
            methods=data;
            //inject into to template
            data = {
				methods:methods,
                total:total};
			var summary = Mustache.render(tmpl_payment_summary,data);
			}
			$('.payment_summary').html(summary);
			
        },
        error: function(req, status, error) {
        
        
        }
    });
       

    });

    


});