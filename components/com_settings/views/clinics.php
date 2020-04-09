
<script>
    
    var clinics = <?=$clinics?>;

</script>

<?$view_title='Settings - Clinics'?>
	<!-- start: Breadcrumb -->
	<?loadModule('view_title');?>
	<!-- /breadcrumb-->

<div class="col-sm-12 col-md-9"><!-- Start Left content -->

<button type="button" class="btn btn-primary save_working_plan btn-block"><i class="fas fa-save"></i>&nbsp;Save</button>
<div class="clinics_container" style="">
    
                  
</div>                
</div>
<div class="col-md-3 visible-md visible-lg" id="feed"><!-- Start Right content -->
	<?loadModule('settings_menu');?>
	

</div><!--/col /Right Content-->


<!--load the Templates-->

<?include(TEMPLATES . 'clinics.html'); ?>