<?
require_once ('../wp-config.php');
//error_reporting(E_ALL);
//ini_set('display_errors', '1');

?>

<!DOCTYPE html>
<html>
	<head>
	<?php require_once ('includes/head.php');?>
	

    </head> 
<body>
<?php 

include('includes/configuration.php');
include($config['path_wp-config']);
include('libraries/alice/alice.php');




		?>

	<!-- start: Header -->
		
	<!-- end: Header -->
		<!-- start: Container -->
		<div class="container">
			<div class="row">
				
				<!-- start: Main Menu -->
				
				<!-- end: Main Menu -->
						
			<!-- start: Content -->
				
		
				<div id="content" class="col-sm-12 full">
		
			
			<div class="row"> <!-- start row that holds all content-->
				
				
				<!-- start: Component -->
				<?include('components/com_login/login.php')?>
				
				
				
				
				<!-- /component-->
				</div>
			</div> <!-- /row that holds all content -->
				
		</div><!--content-->		
		
	</div><!--/container-->
	
 <?loadModule('footer');?>
<?
?>
</body>
</html>



