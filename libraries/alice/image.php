<?php
class Image {
    public $image_id;
	
	public static function insertImage($patientID,$filename,$tag) {
		global $wpdb;
		$wpdb->insert( 
				'table_images', 
				array( 
					'patient_id' => $patientID, 
					'tag' => $tag,
					'filename' => $filename			
					) 
	 			);
	 			
	 	error_log($wpdb->insert_id);		
	 	//$this->image_id = $wpdb->insert_id;
		
	
	}
    
    public function getImages($patient_id,$tag) {
        global $wpdb;
        $query=sprintf('SELECT * from table_images WHERE (patient_id = "%s" AND tag = "%s" )',$patient_id,$tag);
		$images=$wpdb->get_results($query);
		return  $images;
        
    }

}

?>