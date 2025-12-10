<?php $view_title='Settings - General'?>

<div class="col-sm-12 col-md-9"><!-- Start Left content -->
	
	<!-- start: Breadcrumb -->
	<?php loadModule('view_title');?>
	<!-- /breadcrumb-->
	
	<div class="row">
	
	<H3>General Setting</H3>   
											
										    
	<?php 
	
	if ( current_user_can('add_payment_for_all_practitioners') ) {
    echo 'The current user can add payments for all practitioners';
    }
	
	
	?>
									
	
	</div><!--/row-->

	<div class="row">
	
	</div>

</div><!--/col /left content -->

<div class="col-md-3 visible-md visible-lg" id="feed"><!-- Start Right content -->
	<?php loadModule('settings_menu');?>
	

</div><!--/col /Right Content-->

</div><!--/row-->

