<div class="col-sm-12 col-md-9"><!-- Start Left content -->
	
	<!-- start: patient_name -->
	<?loadModule('patient_name');?>
	
	<!-- /patient_name-->
	
<div class="row">
	<a type="button" class="btn btn-primary" href="index.php?com=letter&view=select_category&patient_id=<?echo $patient_id?>&user_id=<?echo $user->ID?>">New Letter</a>
</div>

<div class="row">&nbsp;</div>

<div class="row">
       	
   		<div class="box">
			<div class="box-header">
				<h2><i class="icon-reorder"></i><span class="break"></span>Letters</h2>
			</div>
			
			<div class="box-content">
        		<table class="table">
		         <thead>
		           <tr>
		             <th>TimeStamp</th>
		             <th>Letter Name</th>
		             <th>Internal Note</th>
		             
		   		   </tr>
		         </thead>
		         <tbody>
		           
		           <?foreach ($letters as $letter) 
     				{?>		
		           <tr id="<?=$letter->letter_id?>">
		           	 <td><?echo $letter->timestamp?></td>
		             <td><?echo $letter->name?></td>
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

 		
			

				



