
<script>
    
    var clinics = <?=$clinics?>;

</script>

<?$view_title='Settings - Clinics'?>
	<!-- start: Breadcrumb -->
	
	<!-- /breadcrumb-->

<div class="col-sm-12 col-md-9"><!-- Start Left content -->
	<?loadModule('view_title');?>

	<div class="clinics_container" style="">

	</div>                
	
</div>
<div class="col-md-3 visible-md visible-lg" id="feed"><!-- Start Right content -->
	<?loadModule('settings_menu');?>
	

</div><!--/col /Right Content-->


<!--load the Templates-->

<?include(TEMPLATES . 'clinics.html'); ?>