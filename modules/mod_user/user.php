<?php
//$thierry = $_SESSION["login"];

switch ($view)
{
	case 'dropdown':
		global $current_user;
      	global $config;
		get_currentuserinfo();
		
		$username = $current_user->user_firstname . ' ' . $current_user->user_lastname;
		$nonce =  wp_create_nonce();
		$redirect_to = $config['redirect_to']; // the page to redirect to after login
		
		 
		
      	include('views/dropdown.php');
      //"http://dev.rugcentrumgent.be/wp/wp-login.php?action=logout&amp;_wpnonce=d1b9e84502
      	
	break;
}



?>