<?php
$config = array();

// only change these values 
$config['wp_root']					=   'https://192.168.0.2/alice/';	
$config['root']						= 	'https://192.168.0.2/alice/app/';
$config['path_wp-config']           =   '../wp-config.php';                                 
$config['redirect_to']              =   'wp-login.php?redirect_to=app/index.php';           //the page to redirect to after login

$config['debug_mode']               = 	true;


$config['signature_path']           ='img/signatures/';

define('INCLUDE_PATH',              ROOT . 'includes/');

setlocale(LC_TIME, 'NL_nl');

?>