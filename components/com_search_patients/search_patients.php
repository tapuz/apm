<?php
//search_patients Component 



loadJS('search-patient.js','search_patients');



//get expected patients for practitioner to select from

$patients_for_today = 	Patient::getPatientsForToday(); 
		                                      
		                                      

//include('views/search-patient.php');

echo "kaka";


//echo $_SERVER["DOCUMENT_ROOT"];


?>