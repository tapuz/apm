<?php 
//Component Debug

loadJS('debug.js','debug');


switch (getVar('task')){
	
	case 'getErrors':
	 	$file = 'error.log';

        $fp = fopen($file, 'r');

        if ($fp) {
        $lines = array();

        while (($line = fgets($fp)) !== false) {
        $lines[] = $line;

        while (count($lines) > 400)
            array_shift($lines);
        }

        foreach ($lines as $line) {
        print $line;

        }

        fclose($fp);
        }	
	break;
	
	case 'break':
		error_log('[BREAK]');
		error_log('--------------------------------------------------------');
		
	break;
	
}





switch (getView())
{
	
	case 'default':
		include('views/default.php');
	break;
	
	
	
}


?>




