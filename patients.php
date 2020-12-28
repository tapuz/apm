<!DOCTYPE html>
<html>
	<head>
	<?php require_once ('includes/head.php');?>
	

    </head> 
<body>
<?php 

//login

$creds = array();
$creds['user_login'] = 'thierry';
$creds['user_password'] = 'benzazoupat';
$creds['remember'] = false;
$user = wp_signon( $creds, false );
if ( is_wp_error($user) )
   echo $user->get_error_message();
//login


include('pages/search_patient.php');



?>


</body>
</html>




<?php

   
  

?>
