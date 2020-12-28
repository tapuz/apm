hello there
<div class="row">
	<!-- start: Search Patient -->
	<div class="col-lg-5">
		<div class="form-group">
			<label class="control-label" for="search-patient">
				Search patient...
			</label>
			<div class="controls">
				<div class="input-group">
					<input id="search-patient" class="form-control" size="6" type="text">
					<span class="input-group-btn">
						<button class="btn" type="button">
							Search
						</button>
					</span>
				</div>
			</div>
		</div>
	</div> <!--/col-->
</div><!--/row-->
	
	<div class="row">
		<div id="results">
		</div>
	</div>
	<!--/row-->
</div>
<!--/Search Patient-->

<div class="row">
	<div class="col-md-6">
	       	
   		<div class="box">
			<div class="box-header">
				<h2><i class="icon-reorder"></i><span class="break"></span>Patients for Today</h2>
			</div>
			
			<div class="box-content">
        		<table class="table">
		         <thead>
		           <tr>
		           	 <th>Patient</th>	
		             <th></th>
		             <th></th>
		             
		   		   </tr>
		         </thead>
		         <tbody>
		           
		           <?foreach ($patients_for_today as $patient_for_today) 
     				{?>		
		           <tr id="<?=$patient_for_today->patient_id?>">	 
		           	 <td><?=$patient_for_today->patient_id?></td>
		           	 <td><?=$patient_for_today->patient_surname?></td>
		             <td><?=$patient_for_today->patient_dob?></td>
		             <td>
		             	<a class="btn btn-success" a href="index.php?com=patient&view=patient&patient_id=<?=$patient_for_today->patient_id?>">View</a>
		      
		             </td>
		             
		           </tr>
        	
    			
			    <? }?>
			    </tbody>
   			   </table>
   			</div>
   		</div>
   	</div><!--/col -->
   
</div><!--/row -->