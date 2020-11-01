<?php
header('Access-Control-Allow-Origin: *');  
include('configuration.php');
require_once ($config['path_wp-config']);

define('ROOT',						dirname(__FILE__));
define('Ajax_mode',true);


//check debug mode


if ($config['debug_mode'] === true)
	{
		error_reporting(E_ALL);
        ini_set('display_errors', 'off');
        ini_set('log_errors', 'on');
        ini_set('error_log', 'error.log');
	}
	

include('libraries/alice/alice.php');



// login is not needed if API key is set
$api = false;
$api_key = 'USxgbPOrHHI$bZ1Mos7Bp*q4Q3av8CaUZfaga7*kBp90DEB4s';

if (getVar('APIKey') == $api_key){
    $api=true;
}



if ( is_user_logged_in() || $api ) {
   
} else {
    die();
    login();
}
if (getVar('com')<>'debug'){
    error_log('AJAX called -> component [' . getVar('com') . '] and task [' . getVar('task') .']' );
    error_log('AJAX_GET called!!');

}
include('includes/component_selector.php');





?>
