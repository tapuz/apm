<?$view_title='Settings - Edit Template'?>

<div class="col-sm-12 col-md-9"><!-- Start Left content -->
	
	<!-- start: Breadcrumb -->
	<?loadModule('view_title');?>
	<!-- /breadcrumb-->
	<div class="row">
		<a class="btn btn-primary pull-right" a href="index.php?com=settings&view=templates&category_id=<?=$category_id?>">Back</a>
	</div>
	<div class="row">
		<label for="template_name">Template name:</label>
    	<input class="form-control" type="text" name="template_name" id="template_name" value="<?=$template->name?>"  />
	</div>
	<div class="row">&nbsp;</div>
	<div class="row">
		
			<button id="btn_save_template" type="button" class="btn btn-primary pull-right">Save</button>
		
	</div>
	<div class="row">
		<?editorToolbar();?>
	</div>
	<div class="row">&nbsp;</div>
	<div class="row">
		<div id='editor'>
			<?=$template->template?>
		</div>	
	
	</div><!--/row-->
	<div class="row">&nbsp;</div>
	
<input type="hidden" id="template_id" value="<?=$template->id?>">
</div><!--/col /left content -->

<div class="col-md-3 visible-md visible-lg" id="feed"><!-- Start Right content -->
	
	
	<?loadModule('edit_template_menu');?>
	

</div><!--/col /Right Content-->

</div><!--/row-->



