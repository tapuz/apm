<?php
//component selector

$com = getVar('com');

if ($com==null)
	{
		$com='dashboard'; //this is the standard component
	    
	}

include('components/com_' . $com . '/' . $com . '.php');

?>