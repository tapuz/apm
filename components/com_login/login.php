<?php
// login component
loadJS('login.js','login');


switch (getVar('task')){
	
	case 'login':
		$username = getVar("username");
		$password = getVar("password");

		$creds = array();
		$creds['user_login'] = $username;
		$creds['user_password'] = $password;
		$creds['remember'] = true;
		$user = wp_signon( $creds, true );
		//global $current_user;
		//wp_set_current_user($user->ID);
		if ( is_wp_error($user) )
		{
	 		echo $user->get_error_message();
		} else { // user logged is successfully
			session_start();
			wp_set_current_user($user->ID);
			//session_start();
			//$_SESSION['login'] = 'ok';
			
		
		
			echo "<response>success</response>";
			echo $user->ID;
			if ( is_user_logged_in() ) {
    echo 'Welcome, registered user!';
} else {
    echo 'Welcome, visitor!';
}
		}
		
		add_action( 'after_setup_theme', 'custom_login' );
		
		
		exit;
	break;
	
	case 'logout':
		wp_logout();  
		wp_set_current_user(0);
		//unset($_SESSION['login']);
		//header("Location: login.php");
		//exit;
	break;
	
	
}


include('views/login.php');




?>