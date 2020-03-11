<script>
    var workingPlan = <?=$workingPlan?>; 
    var clinics = <?=$clinics?>;

</script>

<?$view_title='Settings - Working Plan'?>
	<!-- start: Breadcrumb -->
	<?loadModule('view_title');?>
	<!-- /breadcrumb-->

<div class="col-sm-12 col-md-9"><!-- Start Left content -->
<div class="working_plan working-plan-view provider-view" style="">
    
                  
</div>                
</div>
<div class="col-md-3 visible-md visible-lg" id="feed"><!-- Start Right content -->
	<?loadModule('settings_menu');?>
	

</div><!--/col /Right Content-->


<!--load the Templates-->

<?include(TEMPLATES . 'working_plan.html'); ?>