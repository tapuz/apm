
<script>
    
    var clinics = <?=$clinics?>;

</script>

<?php $view_title='Settings - Clinics'?>
	<!-- start: Breadcrumb -->
	
	<!-- /breadcrumb-->

<div class="col-sm-12 col-md-9"><!-- Start Left content -->
	<?loadModule('view_title');?>
	
	<div class="clinics_container" style="">

	</div>                
	
</div>
<div class="col-md-3 visible-md visible-lg" id="feed"><!-- Start Right content -->
	<?php loadModule('settings_menu');?>
	

</div><!--/col /Right Content-->


<!--load the Templates-->

<?php include(TEMPLATES . 'clinics.html'); ?>