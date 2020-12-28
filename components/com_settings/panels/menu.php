<?php
//Component Patients - Panel Menu
function menuPanel ()
{
?>



<div data-role="panel" id="leftpanel">
    	<ul data-role="listview" data-inset="false" data-divider-theme="d">
    		<li data-role="list-divider">Patient Menu</li>
       		<li><a href="index.php?com=letter&page=default&patient_id=<?echo $_GET["patient_id"];?>" data-ajax="false">Letters</a></li>
        	<li><a href="index.php?com=invoice">Invoice</a></li>
        	        
    	</ul>
		
    
   
</div><!-- /panel -->




<?
}
?>




