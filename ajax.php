<?php
// ---------- CORS ----------
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed_origins = [
    'https://tapuz.be',
    'https://timegenics.com'
    // add more if needed
];

if (in_array($origin, $allowed_origins, true)) {
    header("Access-Control-Allow-Origin: $origin");
    header('Vary: Origin');
}

// If you do NOT use cookies/sessions, you could allow all:
// header('Access-Control-Allow-Origin: *');

header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Max-Age: 86400');

// Uncomment ONLY if you rely on cookies / logged-in WordPress
// header('Access-Control-Allow-Credentials: true');

// Handle preflight
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ---------- Bootstrap ----------
require __DIR__ . '/configuration.php';
require_once $config['path_wp-config'];

// ---------- Request mode ----------
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    define('AJAXmode', 'POST');
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    define('AJAXmode', 'GET');
}
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
    error_log('the mode is ' . AJAXmode);
    error_log('AJAX called -> component [' . getVar('com') . '] and task [' . getVar('task') .']' );
 
//error_log('APIkey--> ' . getVar('APIKey'));
}
include('includes/component_selector.php');





?>
