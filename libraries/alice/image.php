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
    
    public static function getImages($patient_id,$tag) {
        global $wpdb;
        $query=sprintf('SELECT * from table_images WHERE (patient_id = "%s" AND tag = "%s" )',$patient_id,$tag);
		$images=$wpdb->get_results($query);
		return  $images;
        
	}
	
	public static function deleteImages($images) {
		global $wpdb;
		//$ids = implode("','", $images);
		error_log(print_r($images,TRUE));
		
		foreach ($images as $image) {
			$filename =  $wpdb->get_var( "SELECT filename from table_images where image_id =".$image );
			$wpdb->delete('table_images',array('image_id' => $image));
			unlink(ROOT . "/userdata/camera_pictures/" . $filename ) or die ("Could not delete file");

			
		}


	}

	public static function deletePortfolioImages($images) {
		global $wpdb;
		//$ids = implode("','", $images);
		error_log(print_r($images,TRUE));
		
		foreach ($images as $image) {
			$filename =  $wpdb->get_var( "SELECT filename from table_images where image_id =".$image );
			$wpdb->delete('table_images',array('image_id' => $image));
			unlink(ROOT . "/userdata/portfolio_images/" . $filename ) or die ("Could not delete file");

			
		}


	}
	

}

?>