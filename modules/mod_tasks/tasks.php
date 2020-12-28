<?php
loadLib('task');

//get the tasks
$userID = get_current_user_id();
$tasks = Task::getTasksForUser($userID,1);
$tasksCount = count($tasks);

include('views/dropdown.php');
?>