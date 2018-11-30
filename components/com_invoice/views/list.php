<?
/**
 * 
 * 
 * 
 **/ 

?>

<script>

var pageTitle = '<?=$pageTitle?>';

</script>
<div class="col-sm-12 col-md-9"><!-- Start Left content -->
	
	<!-- start: patient_name -->
	<?loadModule('patient_name');?>
	
	<!-- /patient_name-->
	
<div class="row">
	
	<a type="button" class="btn btn-primary" href="index.php?com=invoice&view=edit_invoice&task=create_new_invoice&patient_id=<?=$patient_id?>">New Invoice</a>
	
	
	
</div>
<div class="row">&nbsp;</div>

<div class="row">
	<div class="col-md-6">
	       	
   		<div class="box">
			<div class="box-header">
				<h2><i class="icon-reorder"></i><span class="break"></span>Invoices</h2>
			</div>
			
			<div class="box-content">
        		<table class="table">
		         <thead>
		           <tr>
		           	 <th>ID</th>	
		             <th>Date</th>
		             <th>Amount</th>
		             
		   		   </tr>
		         </thead>
		         <tbody>
		           
		           <?foreach ($invoices as $invoice) 
     				{?>		
		           <tr id="<?=$invoice->invoice_id?>">	 
		           	 <td><?=$invoice->invoice_id?></td>
		           	 <td><?=$invoice->date?></td>
		             <td><?=$invoice->amount?></td>
		             <td>
		             	<a class="btn btn-success" a href="index.php?com=invoice&view=edit_invoice&invoice_id=<?=$invoice->invoice_id?>&patient_id=<?=$patient_id?>">View</a>
		             	<a class="btn btn-danger delete_invoice" invoice_id="<?=$invoice->invoice_id?>" >Delete</a>
		             </td>
		             
		           </tr>
        	
    			
			    <? }?>
			    </tbody>
   			   </table>
   			</div>
   		</div>
   	</div><!--/col -->
   
</div><!--/row -->



</div><!--/col /left content -->

<div class="col-md-3 visible-md visible-lg" id="feed"><!-- Start Right content -->
		<?loadModule('patient_menu');?>
	
</div><!--/col /Right Content-->
	
</div><!--/row-->

 		
			

				



