<?php
class Users


{
	public static function getAllPractitioners(){
        global $wpdb;
        $userID = get_current_user_id();
		if ( current_user_can('view_all_calendars') ) {
			//only include ID's from the group
			//get the users group ID 
			$query = $wpdb->prepare('SELECT 
		
			b.user_id 
			
			from view_clinics_active_users as a
			join view_clinics_active_users as b
			on a.group = b.group
			
			WHERE a.user_id = %d', $userID);
			$users=$wpdb->get_results($query);
			$users_to_include = [];
			//get the id's into a nice array 
			foreach($users as $user ){
				$users_to_include[]= $user->user_id;
				
			}

			
			$args = array(
			//user role__in to select multiple roles
			'role__in'       => array('practitioner','clinic_admin'),
			'order'          => 'ASC',
			'orderby'        => 'display_name',
			'fields'         => 'all_with_meta',
			'include'        => $users_to_include
			);
			
		} else {
			
			$args = array(
			'include'          => array(get_current_user_id()),
			'fields'         => 'all_with_meta'
			);
		}
		// The User Query
			$user_query = new WP_User_Query( $args );
			$users = $user_query->results;
			
			//include meta values in user object by making use of magic PHP __get 
			//https://codex.wordpress.org/Class_Reference/WP_User_Query#Return_Fields_Parameter
		foreach($users as $user){
			$user->{"workingPlan"} = $user->working_plan;
			$user->{"calSlotDuration"} = $user->calSlotDuration;
			$user->{"showpatIDinCalendar"} = $user->showpatIDinCalendar;
			//error_log($user->working_plan_2);
		 	//error_log(print_r(get_user_meta ($user->ID, 'working_plan_2'),1));;
        }
		//error_log('fjdsfkdjsfkdjsfkdsjfkds');
		//error_log(print_r($users));
        return $users;
    }
    
    public static function getAllUsers(){
        global $wpdb;
        $userID = get_current_user_id();
		if ( current_user_can('view_all_calendars') ) {
			//only include ID's from the group
			//get the users group ID 
			$query = $wpdb->prepare('SELECT 
		
			b.user_id 
			
			from view_clinics_active_users as a
			join view_clinics_active_users as b
			on a.group = b.group
			
			WHERE a.user_id = %d', $userID);
			$users=$wpdb->get_results($query);
			$users_to_include = [];
			//get the id's into a nice array 
			foreach($users as $user ){
				$users_to_include[]= $user->user_id;
				
			}

			
			$args = array(
			//user role__in to select multiple roles
			'order'          => 'ASC',
			'orderby'        => 'display_name',
			'fields'         => 'all_with_meta',
			'include'        => $users_to_include
			);
			
		} else {
			
			$args = array(
			'include'          => array(get_current_user_id()),
			'fields'         => 'all_with_meta'
			);
		}
		// The User Query
			$user_query = new WP_User_Query( $args );
			$users = $user_query->results;
			
			//include meta values in user object by making use of magic PHP __get 
			//https://codex.wordpress.org/Class_Reference/WP_User_Query#Return_Fields_Parameter
		return $users;

	}
	
	
	
}
?>