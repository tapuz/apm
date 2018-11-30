$(function() {
	
	document.title = pageTitle;
	
	$('.date-picker').datepicker();
	
	$('#invoice_items').on("blur", ".item_price", function() {
		updateSumInvoice();
    	
	});
	
	
	
	function updateSumInvoice(){
		var sum = 0;
    	$('.item_price').each(function() {
        	sum += Number($(this).val());
    	});
	
    
    	$('#sum_invoice').html(sum);
    	$('#sum_invoice_print').html(sum);
    	
    	
    	
    	//update the sum in the db
    	var invoice_id = $("#invoice_id").val();
    	$.ajax({
  			type: "post",
		    url: "ajax.php",
  			data: { com: 'invoice', 
  					task: 'update_sum_invoice', 
  					invoice_id: invoice_id,
  					total:sum}
			}).done(function( response ) {
				console.log(response);
				
					//var n = noty({text: 'Sum Updated',type: 'success',layout:'topCenter'});
					
			});
    	
	}
	
	$( ".invoiceField" ).change(function() {
		var invoice_id = $("#invoice_id").val();
		var note = $("#note").val();
		$.ajax({
  			type: "post",
		    url: "ajax.php",
  			data: { com: 'invoice', 
  					task: 'saveInvoice', 
  					invoice_id: invoice_id,
  					note:note}
			}).done(function( response ) {
				console.log('Invoice Saved!!');
					
			});
	});
	
	$('#invoice_items').on("click", ".delete_invoice_item", function() {
		var invoice_item_id = $(this).attr('invoice_item_id');
		var payment_id = $(this).attr('payment_id');
		console.log(invoice_item_id);
		
		$.ajax({
  			type: "post",
		    url: "ajax.php",
  			data: { com: 'invoice', 
  					task: 'delete_invoice_item', 
  					invoice_item_id: invoice_item_id,
  					payment_id: payment_id}
			}).done(function( response ) {
				console.log(response);
				
					//var n = noty({text: 'Invoice item deleted',type: 'success',layout:'topCenter'});
					$('#'+invoice_item_id).remove();
  				updateSumInvoice();
			});
	
		
	});
	
	
	
	$( ".add_payment_to_invoice" ).click(function() {
		var invoice_id = $("#invoice_id").val();
		var payment_date = $(this).attr( 'payment_date' );
		var item_description = 'Consultatie ' + payment_date;
		var item_price = $(this).attr( 'amount' );
		var payment_id = $(this).attr('payment_id');
		//console.log(payment_id);
			$.ajax({
  			type: "post",
		    url: "ajax.php",
  			data: { com: 'invoice', 
  					//dataType:'html',
  					task: 'add_invoice_item', 
  					invoice_id: invoice_id,
  					payment_id: payment_id,
  					item_description : item_description,
  					item_price : item_price }
			}).success(function( response ) {
				console.log(response);
				//console.log($(response).text());
				var invoice_item_id = $(response).filter('#response').text();
				
				console.log(invoice_item_id);
				
				
				var html = '<tr id="'+invoice_item_id+'"> \
								<td>Consultatie ' + payment_date + '</td> \
								<td><div class="input-prepend input-group"> \
										<span class="input-group-addon">€</span> \
										<input id="appendedPrependedInput" class="form-control item_price" size="16" type="text" value="'+item_price+'"> \
									  </div></td> \
								<td><a class="btn btn-danger delete_invoice_item glyphicon glyphicon-remove" invoice_item_id="'+invoice_item_id+'" payment_id="'+ payment_id +'"></a></td>\
							</tr>';
				
				$("#invoice_items tr:last").before(html);
				//$('#mytable tr:last').before("<tr><td>new row</td></tr>")
				$('#payment_'+payment_id).remove();
				updateSumInvoice();
				
  				
			});
		
		
	});
	
	
	$( ".delete_invoice" ).click(function() {
		var invoice_id = $(this).attr( 'invoice_id' ); // get the invoice id
							
		bootbox.confirm("Are you sure?", function(result) {
		if (result == true) // delete the invoice from db
		{
			console.log('confirmed...');
										
			$.ajax({
  			type: "post",
		    url: "ajax.php",
  			data: { com: 'invoice', 
  					task: 'delete_invoice', 
  					invoice_id: invoice_id}
			}).success(function( response ) {
				console.log(response);
				
					var n = noty({text: 'Invoice Deleted',type: 'success',layout:'topCenter'});
					$('#'+invoice_id).remove();
				
				
				
  				
			});
		}
			
		}); 


	});
	
	updateSumInvoice();
		

});

function printInvoice() {
		//var clinic_logo = $("#clinic_logo").val();
	
		var header = $('#invoice_heading').val();
		$('#invoice').printThis({header: header});
	
	
	}

