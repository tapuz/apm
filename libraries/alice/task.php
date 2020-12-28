<?php
/**
 *The Task library
 * 
 *
**/

class Task {

public static function getTasksByUser($creator_id) {  
    global $wpdb;
	$query=sprintf("
	SELECT
       table_tasks.task_id,
       table_tasks.task,
       table_tasks.note,
	   table_tasks.status,
       table_tasks.creator_id as creator_id,
       table_tasks.assigned_to_id as assigned_id,
       users_creator.display_name as creator,
       users_assigned.display_name as assigned
	        
	FROM table_tasks 
	INNER JOIN wp_users AS users_creator
        ON table_tasks.creator_id = users_creator.ID
	INNER JOIN wp_users AS users_assigned
        ON table_tasks.assigned_to_id = users_assigned.ID
	
	WHERE (table_tasks.creator_id = '%s' AND table_tasks.assigned_to_id != '%s' AND table_tasks.status != 2)"
	 ,$creator_id,$creator_id);
	
	$tasks=$wpdb->get_results($query);
	return  $tasks;
    
    
}

public static function getTasksForUser($user_id,$statusMax) { 
    global $wpdb;
	$query=sprintf("
	SELECT
       table_tasks.task_id,
       table_tasks.task,
       table_tasks.note,
	   table_tasks.status,
       table_tasks.creator_id as creator_id,
       table_tasks.assigned_to_id as assigned_id,
       users_creator.display_name as creator,
       users_assigned.display_name as assigned

	FROM table_tasks 
	INNER JOIN wp_users AS users_creator
        ON table_tasks.creator_id = users_creator.ID
	INNER JOIN wp_users AS users_assigned
        ON table_tasks.assigned_to_id = users_assigned.ID 
	WHERE (table_tasks.assigned_to_id = '%s' AND table_tasks.status < '%s')"
	 ,$user_id,$statusMax);
	
	$tasks=$wpdb->get_results($query);
	return  $tasks;
    
    
}

public static function getLatestActivity($user_id) {
	global $wpdb;
	$query=sprintf(" 
	SELECT t.task_id,
		   t.task,
		   c.comment,
		   c.timestamp,
		   c.user_id,
		   u.display_name
	FROM table_tasks t
	
    LEFT JOIN table_tasks_comments c on c.task_id = t.task_id
      and 
    c.id>
    (select id from table_tasks_comments  
        where task_id=t.task_id
        order by id DESC LIMIT 1,1)

	LEFT JOIN wp_users u on c.user_id = u.ID
	WHERE (t.assigned_to_id = '%s' OR t.assigned_to_id ='%s')
	GROUP BY t.task_id
	ORDER BY COALESCE(MAX(c.timestamp), t.timestamp) DESC
	LIMIT 10",
	$user_id,$user_id);
	
	$latest = $wpdb->get_results($query);
	return $latest;
	
}

public static function getTask($task_id) { 
    global $wpdb;
	$query=sprintf("
	SELECT
       table_tasks.task_id,
       table_tasks.task,
       table_tasks.note,
	   table_tasks.status,
       table_tasks.creator_id as creator_id,
       table_tasks.assigned_to_id as assigned_id,
       users_creator.display_name as creator,
       users_assigned.display_name as assigned

	FROM table_tasks 
	INNER JOIN wp_users AS users_creator
        ON table_tasks.creator_id = users_creator.ID
	INNER JOIN wp_users AS users_assigned
        ON table_tasks.assigned_to_id = users_assigned.ID 
	WHERE (table_tasks.task_id = '%s')"
	 ,$task_id);
	
	$task=$wpdb->get_row($query);
	return  $task;
    
    
}

public static function getTask__test($task_id) { 
    global $wpdb;
	$query=sprintf("
	SELECT
       table_tasks.task_id,
       table_tasks.task,
       table_tasks.note,
	   table_tasks.status,
       table_tasks.creator_id as creator_id,
       table_tasks.assigned_to_id as assigned_id,
       users_creator.display_name as creator,
       users_assigned.display_name as assigned,
	   table_tasks_comments.comment

	FROM table_tasks 
	INNER JOIN wp_users AS users_creator
        ON table_tasks.creator_id = users_creator.ID
	INNER JOIN wp_users AS users_assigned
        ON table_tasks.assigned_to_id = users_assigned.ID
	INNER JOIN table_tasks_comments
		ON table_tasks.tasks_id = table_tasks_comments.task_id
		
	WHERE (table_tasks.task_id = '%s')"
	 ,$task_id);
	
	$tasks=$wpdb->get_results($query);
	return  $tasks;
    
    
}

public static function getComments($task_id){
	 global $wpdb;
	$query=sprintf("
	SELECT
       table_tasks_comments.id,
	   table_tasks_comments.task_id,
	   table_tasks_comments.user_id,
	   table_tasks_comments.comment,
	   table_tasks_comments.timestamp,
	   users.display_name as user
	   
	FROM table_tasks_comments
	INNER JOIN wp_users AS users
		ON table_tasks_comments.user_id = users.ID
	WHERE (table_tasks_comments.task_id=%s)",$task_id);
	   
	
	$comments=$wpdb->get_results($query);
	return  $comments;
}



public static function toggleStatus($task_id){
	global $wpdb;
	$query = sprintf("UPDATE table_tasks SET status = 1 - status where task_id = %s",$task_id); //toggles value from 0 to 1 or 1 to 0
	$wpdb->query($query);
	
	
}

public static function addTask($creator_id,$assigned_to_id,$task,$note){
    global $wpdb;
    $wpdb->insert( 
				'table_tasks', 
				array( 
					'creator_id' => $creator_id,
					'assigned_to_id' => $assigned_to_id,
					'task' => $task, 
					'note' => $note
					) 
	 			);
	//now return the task as OBJ
	$task_id = $wpdb->insert_id;
	
	$new_task = self::getTask($task_id);
	
	return $new_task;
}

public static function archiveTask($task_id) {
    global $wpdb;
	$query = sprintf("UPDATE table_tasks SET status = 2 where task_id = %s",$task_id); 
	$wpdb->query($query);
    
    
}

public static function addComment($task_id,$user_id,$timestamp,$comment){
	global $wpdb;	
	$wpdb->insert( 
				'table_tasks_comments', 
				array( 
					'task_id' => $task_id,
					'user_id' => $user_id,
					'timestamp' => $timestamp, 
					'comment' => $comment
					) 
	 			);
	//now return task_id
	return $new_comment_id = $wpdb->insert_id;
	

}

public static function deleteComment($comment_id){
	global $wpdb;
	$wpdb->delete( 'table_tasks_comments', array( 'id' => $comment_id));
}

public static function saveValue($task_id,$thekey,$thevalue){
	global $wpdb;
	$query = sprintf("UPDATE table_tasks SET %s = '%s' where task_id = %s",$thekey,$thevalue,$task_id);
	$wpdb->query($query);
}


}

?>