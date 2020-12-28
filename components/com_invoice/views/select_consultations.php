<?
/**
 * Create invoice
 * 
 * 
 **/ 

?>
<div class="col-sm-12 col-md-9"><!-- Start Left content -->
	
	<!-- start: patient_name -->
	<?loadModule('patient_name');?>
	
	<!-- /patient_name-->
	
<div class="row">
	
	<a type="button" class="btn btn-primary" href="index.php?com=letter&view=select_category&patient_id=<?echo $patient_id?>&user_id=<?echo $user->ID?>">New Invoice</a>
	
	
	
</div>
<div class="row">&nbsp;</div>

<div class="row">
	<div class="col-md-8">
		Invoice details	
		
	</div><!--/col -->					

	<div class="col-md-4">
   		<div class="box">
			<div class="box-header">
				<h2><i class="icon-reorder"></i><span class="break"></span>Consultations</h2>
			</div>
			<div class="box-content">
				<table class="table">
					<thead>
						<tr>
							<th>Date</th>
							<th>S</th>
							<th>O</th>
							<th>T</th>
					 		<th>Practitioner</th>
						</tr>
					</thead>   
					<tbody>
					<?
					foreach($appointments as $appointment){
						?>
						<tr>
							<td>
								<?
								echo $appointment->scheduled_date?>
							</td>
							<td>++</td>
							<td>SLR 95deg</td>
							<td>T10;L5</td>
							<td>
								<?
								echo $appointment->scheduled_practitioner_name?>
							</td>
						</tr>
						<?
					}
					?>
					</tbody>
				</table>
			</div><!--/box-content -->
		</div><!--/box --->
   	</div><!--/col -->
</div><!--/row -->



</div><!--/col /left content -->

<div class="col-md-3 visible-md visible-lg" id="feed"><!-- Start Right content -->
		<?loadModule('patient_menu');?>
	
</div><!--/col /Right Content-->
	
</div><!--/row-->

 		
			

