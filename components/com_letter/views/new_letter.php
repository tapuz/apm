<div data-role="page" class="" id="letter">

<div data-role="panel" id="template_panel" data-position="right" data-display="overlay" >
    	<ul data-role="listview" data-inset="false" data-divider-theme="d">
			<li data-role="list-divider">Templates</li>
		<?foreach ($templates as $template)
     				{?>		
					<li><a href="#" onclick="loadTemplate(<?=$template->id?>)"><?=$template->name?></a></li>           
        	
    			
			    <? }?>
		      
    	</ul>
    
   
</div><!-- /panel -->

  <div data-role="header" data-theme="b" data-position="fixed">
    <h1>New Letter</h1>
    	<a href="index.php?com=letter&page=select_category&patient_id=<?echo $_GET["patient_id"];?>" data-icon="back">Category</a>
    	<a href="#template_panel" data-role="button" data-inline="true" data-icon="bars">Templates</a>
		
  </div>
	<div data-role="content">

		<div>Patient: <strong><?=$patient_name?></strong></div>
    	<input type="text" name="name" id="name" placeholder="Enter letter name"  />
    	<input type="text" name="note" id="note" placeholder="Internal note"  />
		
		<?editorToolbar();?>
		
		<div id='editor'>
			
		
		
		</div>
		
		<a href="#" id="save_new_letter" data-role="button" data-inline="true" data-mini="true">Save</a>
		
	 
	</div><!-- /content -->
	
	
</div><!-- /page - letter -->

<input type="hidden" id="patient_id" value="<?=$patient->patient_id?>">
<input type="hidden" id="user_id" value="<?=$user->ID?>">

<script>
$('#editor').wysiwyg();
</script>
