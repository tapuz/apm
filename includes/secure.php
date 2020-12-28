<?php



if (!is_user_logged_in() ) {
	header("Location: http://dev.rugcentrumgent.be/wp/app/index.php?com=login&view=login&layout=component");
	echo 'user is not logged in';
	
} else {
	echo 'user is logged in';
}
?>