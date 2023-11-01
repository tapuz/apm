<script>
	var user_id = <?=$user_id?>;
	var clinics = <?=$clinics?>;
</script>
<input type="hidden" id="user_id" value="<?=$user_id?>">
<div class="col-sm-12 col-md-9"><!-- Start Left content -->
	<!-- start: Breadcrumb -->
	<?loadModule('breadcrumbs');?>
	<!-- /breadcrumb-->
	
				
<div class="row">
	<div class="col-sm-3">
		<a href="index.php?com=calendar&view=calendar" class="quick-button"><i class="icon-calendar"></i><p>Calendar</p></a>
	</div>
	<div class="col-sm-3">
		<a href="index.php?com=patient&view=search_patients" class="quick-button"><i class="fas fa-users"></i><p>Patients</p></a>
	</div>
	<div class="col-sm-3">
		<a href="index.php?com=tasks&view=list" class="quick-button"><i class="fas fa-clipboard-list"></i><p>Tasks</p></a>
	</div>
	<div class="col-sm-3">
		<a href="index.php?com=settings&view=general" class="quick-button"><i class="fas fa-cogs"></i><p>Settings</p></a>
	</div>
</div>

<div class="row"> &nbsp;</div>
<div class="row">Where are you working now?</div>
<div class="row"> &nbsp;</div>
<div class="row clinicPresentSelectors">
	
</div>
<div class="row"> &nbsp;</div>
<div class="row"> &nbsp;</div>
<div class="row">
</div>	
<!--/row-->

<div class="row">


</div>



</div>
<div class="row"></div>

<div class="row">
	<div class="col-md-4">
		<a type="button" class="btn btn-primary" onclick="addTask();">Add Task</a>
	</div>
</div>
	
<div class="row">&nbsp;</div>

<div class="row">
	<div class="col-md-9">
	       	
   		<div class="box">
			<div class="box-header">
				<h2><i class="icon-reorder"></i><span class="break"></span>Your tasks</h2>
			</div>
			
			<div class="box-content">
        		<table class="table tasks" id="table_tasks_for_user">
		         <thead>
		           <tr>
		             <th>Task</th>
		             <th>Note</th>
					 <th>Created by</th>
					 <th>Actions</th>
					 
		             
		   		   </tr>
		         </thead>
		         <tbody>
		           
		           <?foreach ($tasksForUser as $task) 
     				{?>
					<tr id="<?=$task->task_id?>">
					<?if ($task->status == 1){ // task is completed -> apply task_completed class?> 
						<td class='task task_completed'><?=$task->task?></td>
					 <?}else{?>
						 <td class='task'><?=$task->task?></td>
					 
					 <?}?>
		           	 
		           	 <td><?=$task->note?></td>
					 <td><?=$task->creator?></td>
					
		           	 
		             <td style="white-space: nowrap">
						<a class="btn btn-success complete_task glyphicon glyphicon-ok" task_id="<?=$task->task_id?>"></a>
						<a class="btn btn-primary edit_task glyphicon glyphicon-edit" task_id="<?=$task->task_id?>"></a>
						<a class="btn btn-danger archive_task glyphicon glyphicon-folder-open" task_id="<?=$task->task_id?>"></a>
						
		             </td>
		             
		           </tr>
        	
    			
			    <? }?>
			    
			   
			    </tbody>
   			   </table>
				
			
				
				
				
   			</div>
   		</div>
   	</div><!--/col -->
   
</div><!--/row -->

<div class="row">
	<div class="col-md-9">
	       	
   		<div class="box">
			<div class="box-header">
				<h2><i class="icon-reorder"></i><span class="break"></span>Tasks assigned by you</h2>
			</div>
			
			<div class="box-content">
        		<table class="table tasks" id="table_tasks_by_user">
		         <thead>
		           <tr>
		             <th>Task</th>
		             <th>Note</th>
					 <th>Assigned to</th>
					 <th>Actions</th>
					 
		             
		   		   </tr>
		         </thead>
		         <tbody>
		           
		           <?foreach ($tasksByUser as $task)
					
     				{
						
						?>
					<tr id="<?=$task->task_id?>">
					<?if ($task->status == 1){ // task is completed -> apply task_completed class?> 
						<td class='task task_completed'><?=$task->task?></td>
					 <?}else{?>
						 <td class='task'><?=$task->task?></td>
					 
					 <?}?>
		           	 
		           	 <td><?=$task->note?></td>
					 <td><?=$task->assigned?></td>
					
		           	 
		             <td style="white-space: nowrap">
						<a class="btn btn-success complete_task glyphicon glyphicon-ok" task_id="<?=$task->task_id?>"></a>
						<a class="btn btn-primary edit_task glyphicon glyphicon-edit" task_id="<?=$task->task_id?>"></a>
		             	<a class="btn btn-danger archive_task glyphicon glyphicon-folder-open" task_id="<?=$task->task_id?>"></a>
						
		             </td>
		             
		           </tr>
        	
    			
			    <? }?>
			    
			   
			    </tbody>
   			   </table>
				
			
				
				
				
   			</div>
   		</div>
   	</div><!--/col -->
   
</div><!--/row -->

<div class="row">
	&nbsp;<br>
	<p>
	<h2>&nbsp; Issue tracker</h2>
	</p>
</div>
	<div class="col-lg-10">
					<div class="box">
						<div class="box-header">
							<h2><i class="fas fa-bug red"></i>Work done</h2>
							<div class="box-icon">
								
							</div>
						</div>
						<div class="box-content">
							<table class="table bootstrap-datatable datatable small-font">
								<thead>
									<tr>
										<th>Type</th>
										<th>Date</th>
										<th>Issue</th>
										<th>Description</th>
										<th>Number</th>
									</tr>
								</thead>   
								<tbody id='done'>
								
									
																			
								</tbody>
							</table>
						</div>
					</div>
	</div>
	<div class="col-lg-10">
					<div class="box">
						<div class="box-header">
							<h2><i class="fas fa-bug red"></i>List of known bugs</h2>
							<div class="box-icon">
								
							</div>
						</div>
						<div class="box-content">
							<table class="table bootstrap-datatable datatable small-font">
								<thead>
									<tr>
										<th>Type</th>
										<th>Date</th>
										<th>Issue</th>
										<th>Description</th>
										<th>Number</th>
									</tr>
								</thead>   
								<tbody id='issues'>
								
									
																			
								</tbody>
							</table>
						</div>
					</div>
	</div>

	<div class="col-lg-10">
					<div class="box">
						<div class="box-header">
							<h2><i class="far fa-star"></i>List of proposed enhancements</h2>
							<div class="box-icon">
							
							</div>
						</div>
						<div class="box-content">
							<table class="table bootstrap-datatable datatable small-font">
								<thead>
									<tr>
										<th>Type</th>
										<th>Date</th>
										<th>Enhancement</th>
										<th>Description</th>
										<th>Number</th>
									</tr>
								</thead>   
								<tbody id='enhancements'>
								
									
																			
								</tbody>
							</table>
						</div>
					</div>
	</div>





</div>
<!--/col /left content -->
<div class="col-md-3 visible-md visible-lg" id="feed"><!-- Start Right content -->
<?
//loadModule('activity_feed')?>
<div class="row">&nbsp;</div>
<div class="row">&nbsp;</div>
<div class="row">&nbsp;</div>
<div class="row">&nbsp;</div>
<div class="col-lg-12">
		<div class="smallstat box">
			<div class="boxchart-overlay blue">
				<div class="boxchart">
					5,6,7,2,0,4,2,4,8,2,3,3,2
				</div>
			</div>
			<span class="title">
				Patients today
			</span>
			<span class="value">
				<?=$numberOfPatientsToday?>
			</span>
			<a href="" class="more">
				<span>
					View More
				</span>
				<i class="icon-chevron-right">
				</i>
			</a>
		</div>
	</div>
	
	<div class="col-lg-12">
		<div class="smallstat box">
			<div class="boxchart-overlay green">
				<div class="linechart">
					120,140,150,100,30,120
				</div>
			</div>
			<span class="title">
				Patients this week
			</span>
			<span class="value">
				<?=$numberOfPatientsThisWeek?>
			</span>
			<a href="" class="more">
				<span>
					View More
				</span>
				<i class="icon-chevron-right">
				</i>
			</a>
		</div>
	</div>

	<div class="col-lg-12">
		<div class="smallstat box">
			<div class="boxchart-overlay green">
				<div class="linechart">
					120,140,150,100,30,120
				</div>
			</div>
			<span class="title">
				Patients next week
			</span>
			<span class="value">
				<?=$numberOfPatientsNextWeek                                                                                ?>
			</span>
			<a href="" class="more">
				<span>
					View More
				</span>
				<i class="icon-chevron-right">
				</i>
			</a>
		</div>
	</div>

	<div class="col-lg-12">
		<div class="smallstat box">
			<div class="boxchart-overlay red">
				<div class="boxchart">
					5,6,7,2,0,4,2,4,8,2,3,3,2
				</div>
			</div>
			<span class="title">
				New Patients this week
			</span>
			<span class="value">
				0
			</span>
			<a href="" class="more">
				<span>
					View More
				</span>
				<i class="icon-chevron-right">
				</i>
			</a>
		</div>
	</div>

	<div class="col-lg-12">
		<div class="smallstat box">
			<div class="boxchart-overlay yellow">
				<div class="linechart">
					1,2,6,4,0,8,2,4,5,3,1,7,5
				</div>
			</div>
			<span class="title">
				Earnings this week
			</span>
			<span class="value">
				+-<?=$numberOfPatientsThisWeek*45?> euro
			</span>
			<a href="" class="more">
				<span>
					View More
				</span>
				<i class="icon-chevron-right">
				</i>
			</a>
		</div>
	</div>
</div>
<!--/col /Right Content-->
</div>
<!--/row-->
<div class="modal fade" id="myModal">
<div class="modal-dialog">
<div class="modal-content">
	<div class="modal-header">
		<button type="button" class="close" data-dismiss="modal" aria-hidden="true">
			&times;
		</button>
		<h4 class="modal-title">
			Modal title
		</h4>
	</div>
	<div class="modal-body">
		<p>
			Here settings can be configured...
		</p>
	</div>
	<div class="modal-footer">
		<button type="button" class="btn btn-default" data-dismiss="modal">
			Close
		</button>
		<button type="button" class="btn btn-primary">
			Save changes
		</button>
	</div>
</div>
<!-- /.modal-content -->
</div>
<!-- /.modal-dialog -->
</div>
<!-- /.modal -->
<div class="clearfix">
</div>