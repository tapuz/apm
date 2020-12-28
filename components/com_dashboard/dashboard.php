<?php 
//dashboard Component

loadLib('task');


$component_root = $config['root'] . 'components/com_dashboard/';

//loadCSS('letter.css','letter');
//loadJS('letter.js','letter');
loadLib('calendar');
loadJS('dashboard.js','dashboard');
loadJS('tasks.js','tasks');
loadCSS('tasks.css','tasks');
//load the page
$user_id = get_current_user_id();
$patientsForToday=Calendar::getAppointmentsForToday(get_current_user_id());
$patientsForThisWeek = Calendar::getAppointmentsThisWeek(get_current_user_id());
$patientsForNextWeek = Calendar::getAppointmentsNextWeek(get_current_user_id());
$numberOfPatientsToday = $patientsForToday;//count($patientsForToday);
$numberOfPatientsThisWeek = count($patientsForThisWeek);
$numberOfPatientsNextWeek = count($patientsForNextWeek);

//load the tasks
$tasksForUser = Task::getTasksForUser(get_current_user_id(),2);
$tasksByUser = Task::getTasksByUser( get_current_user_id());


include('views/dashboard.php');






?>
