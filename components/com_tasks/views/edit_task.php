<?
/**
 * Edit a single task
 * 
 * 
 **/ 

?>
<script>
	var task_id = <?=getVar('task_id')?>;
	var user_id = <?=$user_id?>;
	var user_name = '<?=$user_name?>';
</script>


<input type="hidden" id="user_id" value="<?=$user_id?>">

<div class="col-sm-12 col-md-9"><!-- Start Left content -->

<ol class="breadcrumb hidden-print">
    <li>Edit task</li>
	<a class="btn btn-primary pull-right btn-sm" a href="<?=$backLink?>">Back</a>
</ol>	
	
<div class="row">
	<div class="form_group">
		<label class="control-label" for="task">Task</label>
		<div class="input-group">
			<input id="task" class="editable form-control" size="10" type="text">
			<span class="input-group-btn"><button class="btn_save btn btn-primary" type="button" disabled>save</button></span>
		</div>
	</div>
</div>

<div class="row">
	<div class="form_group">
		<label class="control-label" for="note">Note</label>
		<div class="input-group">
			<input id="note" class="editable form-control" size="16" type="text">
			<span class="input-group-btn"><button id="ben" class="btn_save btn btn-primary" type="button" disabled>save</button></span>
		</div>
	</div>
</div>

	
<div class="row">&nbsp;</div>

<div class="row">
	<div class="col-md-10">
	    <div class="col-lg-12 discussions">
			<ul id="comments">
				<!--/comments placeholder -->		
															
			</ul>
			
			<ul id="write_comment">
				<!-- write comment placeholder -->	
	           
			</ul>
			
			

		</div><!--/comments -->
   	</div><!--/col -->
   
</div><!--/row -->





</div><!--/col /left content -->

<div class="col-md-3 visible-md visible-lg" id="feed"><!-- Start Right content -->
		
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

 		
			

				





