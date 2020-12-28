<?$view_title='Settings - Letters'?>

<div class="col-sm-12 col-md-9"><!-- Start Left content -->
	
	<!-- start: Breadcrumb -->
	<?loadModule('view_title');?>
	<!-- /breadcrumb-->
	
	<div class="row">
		<div class="box">
						<div class="box-header">
							<h2><i class="icon-list"></i><span class="break"></span>Categories</h2>
							
						</div>
						<div class="box-content">
							<table class="table table-bordered">
								<tbody>
									<?foreach ($categories as $category) 
     								{?>	<tr>	
										 <td class="col-md-8"><?echo $category->name?></td>
										 <td class="col-md-3"><a class="btn btn-success" a href="index.php?com=settings&view=templates&category_id=<?=$category->category_id?>">Templates</a>
		             						 <a class="btn btn-danger delete_letter" letter_id="<?=$letter->letter_id?>" >Delete</a></td>
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


