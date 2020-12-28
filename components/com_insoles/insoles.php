<?php 
//Component Insoles
//loadLib('patient');
//loadLib('insoles');
//loadJS('insoles.js','insoles');

$patient_id = getVar('patient_id');

echo 'this';

switch (getView())
{
	
	case 'default':
		
		//$invoices = Invoice::getInvoices($patient_id);
		//$patient = getPatient($patient_id);
		//set the backLink
		$backLink = "index.php?com=patient&view=patient&patient_id=" . $patient_id;
		include('views/default.php');

	break;
	
	
	
	
}


?>
