<?$view_title='Settings - Letter Templates'?>

<div class="col-sm-12 col-md-9"><!-- Start Left content -->
	
	<!-- start: Breadcrumb -->
	<?loadModule('view_title');?>
	<!-- /breadcrumb-->
	<div class="row">
		<a href="index.php?com=settings&view=edit_template&task=add_new_template&category_id=<?=$category->category_id?>" class="btn btn-primary">New template</a>
		<a class="btn btn-primary pull-right" a href="index.php?com=settings&view=index.php?com=settings&view=select_category">Back</a>
	</div>
	<div class="row">&nbsp;</div>
	<div class="row">
		<div class="box">
						<div class="box-header">
							<h2><i class="icon-list"></i><span class="break"></span><?=$category->name?></h2>
							
						</div>
						<div class="box-content">
							<table class="table table-bordered">
								<tbody>
									<?foreach ($templates as $template) 
     								{?>	
     									<tr id="<?=$template->id?>">
     										<td class="col-md-4"><?echo $template->name?></td>
     										<td class="col-md-5"><?=$template->description?></td>
     										<td>
     											<a class="btn btn-success" href="index.php?com=settings&view=edit_template&template_id=<?echo $template->id?>&category_id=<?=$category->category_id?>">Edit</a>
     											<a class="btn btn-danger delete_template" template_id="<?=$template->id?>">Delete</a>
     										</td>
			 							</tr>
        							<? }?>
								
							</tbody></table>
						</div>	
					</div>	

	
	</div><!--/row-->

</div><!--/col /left content -->

<div class="col-md-3 visible-md visible-lg" id="feed"><!-- Start Right content -->
	<?loadModule('settings_menu');?>
	

</div><!--/col /Right Content-->

</div><!--/row-->

