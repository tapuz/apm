<?php
$v='2.4';
define('VERSION','v.' . $v);
define('ROOT', dirname(__FILE__));

include('configuration.php');
require_once ($config['path_wp-config']);




//check debug mode

if ($config['debug_mode'] === true)
	{
		error_reporting(E_ALL);
        ini_set('display_errors', 'off');
		ini_set('log_errors', 'on');
        ini_set('error_log', 'error.log');
	}

//include the main lib
include('libraries/alice/alice.php');

//check if user is logged in
if ( !is_user_logged_in() ) 
    login($config['redirect_to']); // alice lib


	
?>

<!DOCTYPE html>
<html>
	<head>
	<?php require_once ('includes/head.php');?>
	

    </head> 
<body>
	<div class="loadingscreen"></div>

	<!-- start: Header -->
		<?php if (!componentOnly()){loadModule('header');}?>
	<!-- end: Header -->
		<!-- start: Container -->
		<div id="main_content" class="container">
			<div class="row">
				
				<!-- start: Main Menu -->
				<?if (!componentOnly()){loadModule('main_menu');}?>
				<!-- end: Main Menu -->
						
			<!-- start: Content -->
			<?php if (!componentOnly()){?>
				
				<div id="content" class="col-lg-10 col-sm-11 ">
				
			<?php }else{?>
				<div id="content" class="col-sm-12 full">
			<?php }?>
			
			<div class="row thierry"> <!-- start row that holds all content-->
				
				
				<!-- start: Component -->
				<?php include('includes/component_selector.php');?>
				<!-- /component-->
				</div>
			</div> <!-- /row that holds all content -->
				
		</div><!--content-->		
		
	</div><!--/container-->
	
 <?php //loadModule('footer');?>
<?php
?>
<div id="overlay"></div>
</body>
</html>
