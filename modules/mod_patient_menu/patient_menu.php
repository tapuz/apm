<?
loadLib('appointment');

loadJS('add_payment.js','payment');

$patient_id = getVar('patient_id');
$patient = Patient::getPatient($patient_id);

//get all the patient appointments to display in the side menu

$appointments = Appointment::getAppointments($patient_id);

include('views/patient_menu.php');





?>