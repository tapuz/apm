<?
/**
 * Lists all the payments for the clinics
 * 
 * 
 **/ 

?>
<div class="col-sm-12 col-md-9"><!-- Start Left content -->
	
	<!-- start: patient_name -->
	
	<!-- /patient_name-->
	
<div class="row">&nbsp;</div>

<div class="row">
	<div class="col-md-10">
	       	
   		<div class="box">
			<div class="box-header">
				<h2><i class="icon-reorder"></i><span class="break"></span>Payments</h2>
			</div>
			
			<div class="box-content">
        		<table class="table">
		         <thead>
		           <tr>
		           	 <th>ID</th>	
		             <th>Date</th>
		             <th>Patient</th>
					 <th>Practitioner</th>
		             <th>Description</th>
		             
		   		   </tr>
		         </thead>
		         <tbody>
		           
		           <?foreach ($payments as $payment) 
     				{?>		
		           <tr id="<?=$payment->payment_id?>">	 
		           	 <td><?=$payment->payment_id?></td>
		           	 <td><?=getDateFromTimestamp($payment->payment_date)?></td>
		           	 <td><?=$payment->patient_id?></td>
					 <td><?=$payment->practitioner_id?></td>					 
		           	 <td><?=$payment->description?></td>
		             <td><?=$payment->amount?></td>
		             <td>
		             	<a class="btn btn-success" a href="index.php?com=payment&view=edit_payment&payment_id=<?=$payment->payment_id?>&patient_id=<?=$patient_id?>">View</a>
		             	<a class="btn btn-danger delete_payment" payment_id="<?=$payment->payment_id?>" >Delete</a>
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
		
</div><!--/col /Right Content-->
	
</div><!--/row-->

 		
			

				



