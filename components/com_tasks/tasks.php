<?php 
//Component Tasks
loadLib('task');
loadLib('users');
loadCSS('tasks.css','tasks');



switch (getVar('task')){
	
	case 'add_task':
		$new_task = Task::addTask(getVar('creator_id'),getVar('assigned_to_id'),getVar('taskname'),getVar('note'));		
		//setResponse('Task added...');
		//return the task as JSON
		
		echo json_encode($new_task);
		
		
		
	break;
	
	case 'toggle_status':
		Task::toggleStatus(getVar('task_id'));
	    error_log('doing the task',0);
	break;
	
	case 'archive_task':
		Task::archiveTask(getVar('task_id'));
	break;

	case 'get_users':
		$users = Users::getAllUsers();
		 echo json_encode($users);
		 
	break;

	case 'get_comments':
		$comments = Task::getComments(getVar('task_id'));
		echo json_encode($comments);
		error_log('getting the comments');
	break;

	case 'get_task':
		$task = Task::getTask(getVar('task_id'));
		echo json_encode($task);
		error_log('getting the task');
	break;

	case 'add_comment':
		$new_comment_id = Task::addComment(getVar('task_id'),getVar('user_id'),getVar('timestamp'),getVar('comment'));
		setResponse($new_comment_id);
	break;

	case 'delete_comment':
		//first check if user can delete the comment
		//$user_id = get_current_user_id();
		Task::deleteComment(getVar('comment_id'));
		
	break;

	case 'save_value':
		Task::saveValue(getVar('task_id'),getVar('thekey'),getVar('thevalue'));
	break;

	case 'get_tasks':
		$user_id = get_current_user_id();
		$tasks = Task::getTasksForUser($user_id,1);
		//echo json_encode($tasks);
}



switch (getView())
{
	
	case 'list':
	    $user_id = get_current_user_id();
	   
	    //get all the tasks for the user
	    $tasksForUser = Task::getTasksForUser($user_id,2);
		$tasksByUser = Task::getTasksByUser($user_id);
		$latestActivity = Task::getLatestActivity($user_id);
		//set the backLink
		//$backLink = "index.php?com=patient&view=patient&patient_id=" . $patient_id;
		loadJS('tasks.js','tasks');
		include('views/list.php');

	break;

	case 'edit_task':
		global $current_user;
		get_currentuserinfo();
		$user_name = $current_user->display_name;
		$backLink = "index.php?com=tasks&view=list";
		$user_id = get_current_user_id();
		loadJS('edit_task.js','tasks');
		include('views/edit_task.php');
	
		
	break;
	
	
}


?>
