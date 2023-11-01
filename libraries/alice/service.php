<?
class Service {

    public static function customTimeslotOnly($service){
        global $wpdb;
        $query = $wpdb->prepare('SELECT custom_timeslot_only from table_services where id = %d',$service);
        return $wpdb->get_var($query);
    }
    
    public static function getService($service){
        global $wpdb;
        $query = $wpdb->prepare('
        SELECT * from table_services where id = %d',$service);
        return $wpdb->get_row($query);
        
    }

    public static function getServices(){
        global $wpdb;
        $query='SELECT * FROM table_services';
        return $wpdb->get_results($query);
        
    }

    public static function getAllServices($clinic){
        global $wpdb;
        $query = $wpdb->prepare('
        SELECT * from table_services where clinic = %d',$clinic);
        return $wpdb->get_results($query);

    }

    public static function getRecurrentService($clinic,$user){
        global $wpdb;
        
        $query = $wpdb->prepare('
        SELECT 
            
            table_clinic_user.default_service AS service,
            

            table_services.duration,
            table_services.description
            

            from table_clinic_user
            INNER JOIN table_services
            ON table_clinic_user.default_service = table_services.id
            where(user_id = %d and clinic_id = %d)',$user,$clinic);

        return $wpdb->get_row($query);

        

    }

    public static function getRecurrentUrgentService($clinic,$user){
        global $wpdb;
        
        $query = $wpdb->prepare('
        SELECT 
            
            table_clinic_user.default_service_urgent AS service,
            

            table_services.duration,
            table_services.description
            

            from table_clinic_user
            INNER JOIN table_services
            ON table_clinic_user.default_service_urgent = table_services.id
            where(user_id = %d and clinic_id = %d)',$user,$clinic);

        return $wpdb->get_row($query);

        

    }

    public static function getNPService($clinic,$user){
        global $wpdb;
        
        $query = $wpdb->prepare('
        SELECT 
            
            table_clinic_user.default_service_np as service,
            

            table_services.duration,
            table_services.description
            

            from table_clinic_user
            INNER JOIN table_services
            ON table_clinic_user.default_service_np = table_services.id
            where(user_id = %d and clinic_id = %d)',$user,$clinic);

        return $wpdb->get_row($query);




    }

    public static function getNPUrgentService($clinic,$user){
        global $wpdb;
        
        $query = $wpdb->prepare('
        SELECT 
            
            table_clinic_user.default_service_np_urgent as service,
            

            table_services.duration,
            table_services.description
            

            from table_clinic_user
            INNER JOIN table_services
            ON table_clinic_user.default_service_np_urgent = table_services.id
            where(user_id = %d and clinic_id = %d)',$user,$clinic);

        return $wpdb->get_row($query);




    }
    
}
?>