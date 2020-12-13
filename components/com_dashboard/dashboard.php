<?php 
//dashboard Component


$component_root = $config['root'] . 'components/com_dashboard/';

//loadCSS('letter.css','letter');
//loadJS('letter.js','letter');
loadLib('calendar');
loadJS('dashboard.js','dashboard');
//load the page

$patientsForToday=Calendar::getAppointmentsForToday(get_current_user_id());
$patientsForThisWeek = Calendar::getAppointmentsThisWeek(get_current_user_id());
$patientsForNextWeek = Calendar::getAppointmentsNextWeek(get_current_user_id());
$numberOfPatientsToday = $patientsForToday;//count($patientsForToday);
$numberOfPatientsThisWeek = count($patientsForThisWeek);
$numberOfPatientsNextWeek = count($patientsForNextWeek);



include('views/dashboard.php');






?>
