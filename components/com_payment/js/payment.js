$(document).ready(function(){

    var tmpl_payment_summary = $('#tmpl_payment_summary').html();
	Mustache.parse(tmpl_payment_summary);	
	
	
	//Parse it 
	
	
    $('.btn_load_summary').click(function(){
       clinic = $("#clinic").val();
       practitioner =$("#practitioner").val();

       $.ajax({
        url: "ajax.php",
        dataType: "json",
        type: 'post',
        data: {
        com: 'payment',
        task: 'getpaymentsummary',
        practitioner:practitioner,
        clinic:clinic
        },
        success: function(data) {
            total=data.pop();
            methods=data;
            //inject into to template
            data = {
				methods:methods,
                total:total};
			var summary = Mustache.render(tmpl_payment_summary,data);
			$('.payment_summary').html(summary);
        },
        error: function(req, status, error) {
        
        
        }
    });
       

    });

    


});