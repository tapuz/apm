<div class="col-sm-12 col-md-9"><!-- Start Left content -->
	
	<!-- start: patient_name -->
	<?loadModule('patient_name');?>
	<!-- /patient_name-->
	
	<div class="row">
	
		
			<div class="list-group">
  			<a href="#" class="list-group-item active">Select Category</a>
 		    <?foreach ($categories as $category) 
     		{?>		
			<a class="list-group-item" href="index.php?com=letter&view=edit_letter&task=create_new_letter&category_id=<?=$category->category_id?>&patient_id=<?=$patient->patient_id?>&user_id=<?echo $user->ID?>"><?echo $category->name?></a>         
        	<? }?>
		
		</div>
		
	</div><!--/row-->

</div><!--/col /left content -->

<!-- <div class="col-md-3 visible-md visible-lg" id="feed"><!-- Start Right content -->

	

<!-- </div><!--/col /Right Content--> 

</div><!--/row-->
	
		
