<?
/**
 * Edit Invoice
 * 
 * 
 **/ 

?>

<script>

var pageTitle = '<?=$pageTitle?>';

</script>

<input type="hidden" id="invoice_id" value="<?=$invoice->invoice_id?>">
<input type="hidden" id="invoice_heading" value="<?=$invoice_heading->clinic_invoice_heading;?>">
<div class="col-sm-12 col-md-9" id="invoice"><!-- Start Left content -->
	
	<!-- start: patient_name -->
	<?loadModule('patient_name');?>
	<!-- /patient_name-->
	
<div class="row">
	
<!--	<a class="btn btn-primary pull-right" a href="index.php?com=invoice&view=list&patient_id=<?=$patient->patient_id?>">Back</a>
-->
	
	
</div>



<div class="row">
  <div class="box" id="">
  <div class="box-header hidden-print">
				<h2><i class="icon-edit"></i>Invoice</h2>
			</div>
  <div class="box-content">
 		
 	
  	<div class="row">
  		
  		<div class="input-group col-sm-3">
  			
  				<label for="date">Datum:</label>	
	 			<input type="text" class="form-control date-picker" id="date" data-date-format="dd/mm/yyyy" value="<?=$invoice_date->format('d-m-Y');?>"/>
				
				<label class="control-label" for="note">Note</label>
				<input type="text" class="form-control invoiceField" name="note" id="note" placeholder="Invoice note" value="<?=$invoice->note?>" />
  				
  			
  		
  		</div>
  		<div class="col-sm-6 print_width_30">
				<label for="invoice_address">Ontvangen van:</label>
    
				<div class="well" contenteditable="true" id="invoice_address" rows="5">
					<?=$invoice->address?>
				</div>
		</div>
  		
  		<div class="col-sm-2 pull-right">
			<button onclick="printInvoice();" type="button" class="btn btn-primary">Print</button>
		</div>	
  	
  	
  	
  	</div>
  	
	
<div class="hidden-print">&nbsp;</div>

<div class="hidden-print">&nbsp;</div>
<div class="row">
	<div class="col-md-6">
		<div class="box">
			<div class="box-header hidden-print">
				<h2><i class="icon-edit"></i>Invoice Items</h2>
			</div>
			<div class="box-content">
				
				 
					<table class="table" id="invoice_items">
						<thead>
							<tr>
								<th class="col-sm-5 print_width_50">Item</th>
								<th class="col-sm-3 print_width_30">Honorarium</th>
							</tr>
						</thead>
						<tbody>
							<tr><td><td colspan="3" class="sum_invoice hidden-print"><div>Totaal:</div> <div id="sum_invoice"></div></td></tr>
							<?foreach($invoice_items as $invoice_item){?>
							<tr id="<?=$invoice_item->invoice_item_id?>"> 
								<td><?=$invoice_item->item_description?></td> 
								<td><div class="input-prepend input-group"> 
										<span class="input-group-addon">€</span> 
										<input id="appendedPrependedInput" class="form-control item_price" size="16" type="text" value="<?=$invoice_item->item_price?>"> 
									  </div></td>
								<td><a class="btn btn-danger delete_invoice_item glyphicon glyphicon-remove" invoice_item_id="<?=$invoice_item->invoice_item_id?>" payment_id="<?=$invoice_item->payment_id?>"></a></td>
							</tr>
							
							<?}?>
							<tr><td class="visible-print text-right"><strong>Totaal: €</strong></td><td class="visible-print"><strong><div id="sum_invoice_print"></div><strong></td></strong><td>&nbsp</td></tr>
						</tbody>
					</table>
				
			</div>
		</div>
	
		
	</div><!--/col -->					

	<div class="col-md-6 noprint">
   		<div class="box">
			<div class="box-header">
				<h2><i class="icon-reorder"></i><span class="break"></span>Consultations</h2>
			</div>
			<div class="box-content">
				<table class="table" id="payments">
					<thead>
						<tr>
							<th>Date</th>
							<th>Amount</th>
						</tr>
					</thead>   
					<tbody>
					<?
					foreach($payments as $payment){
						?>
						<tr id="payment_<?=$payment->payment_id?>">
							<td><?=getDateFromTimestamp($payment->payment_date)?></td>
							<td><?=$payment->amount?></td>
							<td><a class="btn btn-primary add_payment_to_invoice" payment_id="<?=$payment->payment_id?>" amount="<?=$payment->amount?>" payment_date="<?=getDateFromTimestamp($payment->payment_date)?>" >Add</a></td>
						</tr>
						<?
					}
					?>
					</tbody>
				</table>
			</div><!--/box-content -->
		</div><!--/box --->
   	</div><!--/col -->
   	</div><!--/box-content -->
   	</div><!--/box -->
   	
</div><!--/row -->
</div><!--/row -->


<div class="row visible-print">
	<?=$signature?>
</div>
<div class="row visible-print">
   <?=$practitioner_name;?>
   		
</div>


</div><!--/col /left content -->

<div class="col-md-3 visible-md visible-lg" id="feed"><!-- Start Right content -->
		<?//loadModule('patient_menu');?>
	
</div><!--/col /Right Content-->
	
</div><!--/row-->

 		
			

