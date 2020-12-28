<?
/**
 * Lists all the Tasks for the user
 * 
 * 
 **/ 

?>
<script>

	
</script>
<input type="hidden" id="user_id" value="<?=$user_id?>">

<div class="col-sm-12 col-md-9"><!-- Start Left content -->
	
<div class="row">
	<div class="col-md-4">
		<a type="button" class="btn btn-primary" onclick="addTask();">Add Task</a>
	</div>
</div>
	
<div class="row">&nbsp;</div>

<div class="row">
	<div class="col-md-10">
	       	
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
	<div class="col-md-10">
	       	
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



</div><!--/col /left content -->

<div class="col-md-3 visible-md visible-lg" id="feed"><!-- Start Right content -->
	<h2></h2>
		<ul id="timeline">
		<?
			
		?>
		</ul>
	
		
</div><!--/col /Right Content-->
	
</div><!--/row-->

<div id="myModal" class="modal fade">
  <div class="modal-dialog">
    <div class="modal-content">
      <!-- dialog body -->
      <div class="modal-body">
        <button type="button" class="close" data-dismiss="modal">&times;</button>
        Hello world!
      </div>
      <!-- dialog buttons -->
      <div class="modal-footer"><button type="button" class="btn btn-primary">OK</button></div>
    </div>
  </div>
</div>

 		
			






