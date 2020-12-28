<div class="col-sm-12 col-md-9"><!-- Start Left content -->
	
	<!-- start: patient_name -->
	<?loadModule('patient_name');?>
	
	<!-- /patient_name-->
	
<div class="row">
	<button onclick="sendPatientToSalesbinder();" type="button" class="btn btn-primary">Create SB Account</button>
</div>

<div class="row">&nbsp;</div>

<div class="row">
       	
   		<div class="box">
			<div class="box-header">
				<h2><i class="icon-reorder"></i><span class="break"></span>Order insole:</h2>
			</div>
			
			<div class="box-content">
        		<table class="table">
		         <thead>
		           <tr>
		             <th>Insole</th>
		             
		   		   </tr>
		         </thead>
		         <tbody>
		           
		           <?foreach ($insoles as $insole) 
     				{?>		
		           <tr id="<?=$insole->insole_id?>">
		           	 <td><?echo $insole->name?></td>
		             <td><?echo $insole->price?></td>
		             <td><?echo $letter->note?></td>
		             <td>
		             	<a class="btn btn-success" a href="index.php?com=letter&view=edit_letter&letter_id=<?=$letter->letter_id?>&patient_id=<?=$patient->patient_id?>">View</a>
		             	<a class="btn btn-danger delete_letter" letter_id="<?=$letter->letter_id?>" >Delete</a>
		             </td>
		             
		           </tr>
        	
    			
			    <? }?>
			    </tbody>
   			   </table>
   			</div>
   		</div>
   		
</div>



</div><!--/col /left content -->

<div class="col-md-3 visible-md visible-lg" id="feed"><!-- Start Right content -->
		<?loadModule('patient_menu');?>
	
</div><!--/col /Right Content-->
	
</div><!--/row-->

 		
			

				



