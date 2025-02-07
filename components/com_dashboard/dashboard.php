<?php 
//dashboard Component

loadLib('task');


$component_root = $config['root'] . 'components/com_dashboard/';

//loadCSS('letter.css','letter');
//loadJS('letter.js','letter');
loadLib('calendar');
loadLib('clinic');
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

global $clinic,$clinicPresent;

$clinics = json_encode(Clinic::getClinics($user_id));

// Get the email data

$apiKey = "cce14145a2835a2e9a34f9f1df69d2cc";
$apiSecret = "a683fe855f8945b0072a6375ec949831";
$senderID = "6484991917";


// Get today's date in UTC (Mailjet uses UTC time)
$today = date("Y-m-d");

// Initialize empty array to store emails
$emails = [];


    // Mailjet API URL with pagination parameters (limit and offset)
    
    $url= "https://api.mailjet.com/v3/REST/message?FromTS=".gmdate("Y-m-d")."T00:00:00&SenderID={{SenderID}}&ShowContactAlt=true&ShowSubject=true&Limit=1000";
    
    // Initialize cURL
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_USERPWD, "{$apiKey}:{$apiSecret}"); // Basic Auth

    // Execute request
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    // Decode JSON response
    $data = json_decode($response, true);
    // Append fetched emails
    $emails = $data['Data'];







include('views/dashboard.php');






?>
