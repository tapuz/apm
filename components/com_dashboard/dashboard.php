<?php 
//dashboard Component


$component_root = $config['root'] . 'components/com_dashboard/';

//loadCSS('letter.css','letter');
//loadJS('letter.js','letter');
loadLib('calendar');
//load the page

$patientsForToday=Calendar::getAppointmentsForToday(get_current_user_id());
$patientsForThisWeek = Calendar::getAppointmentsThisWeek(get_current_user_id());
$numberOfPatientsToday = count($patientsForToday);
$numberOfPatientsThisWeek = count($patientsForThisWeek);



include('views/dashboard.php');






?>
