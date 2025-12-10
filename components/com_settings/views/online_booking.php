
<script>
    
    var settings = <?=$settings?>;

</script>

<?php $view_title='Settings - Online Booking'?>
	<!-- start: Breadcrumb -->
	
	<!-- /breadcrumb-->

<div class="col-sm-12 col-md-9"><!-- Start Left content -->
	<?php loadModule('view_title');?>
	
	<div class="container settings_container" style="">


	</div>                
	
</div>
<div class="col-md-3 visible-md visible-lg" id="feed"><!-- Start Right content -->
	<?php loadModule('settings_menu');?>
	

</div><!--/col /Right Content-->


<!--load the Templates-->

<?php include(TEMPLATES . 'online_booking.html');?>