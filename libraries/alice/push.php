<?php

	class Push {
		var $title;
		var $body;
		var $id;
		var $badge;
		
		public function send(){		
	    //API URL of FCM
		    $url = 'https://fcm.googleapis.com/fcm/send';
		
		    /*api_key available in:
		    Firebase Console -> Project Settings -> CLOUD MESSAGING -> Server key*/
		    $serverKey = 'AAAAMpGli2w:APA91bF1qRp9VHOX00k4U8hcl3_659MMHONrcfLvXBGYLU6COrrNNe4I8qXpwxObW0zwg7wramyGPTr3g9IdSei9gCVDE-zmHQvZ0ZVrNHqOPXwdjL0lgQDIcf6IN4B9Av5X8YpIYJMd';
		                
		    $notification = [
		        'title' => $this->title,
		        'body' => $this->body,
		        'alert' => '',
		        'sound' => 'default',
		        'badge' => $this->badge,
		    ];
		    $data = [
		        'title' => 'This is notification title',
		        'body' =>'This is notification text',
		        'priority' => 'high',
		        'content_available' => true
		    ];
		
		    $fcmNotification = [
		        'to' => $this->id,
		        'notification' => $notification,
		        'data' => $data,
		        'priority' => 10
		    ];
		
		    $headers = [
		        'Authorization: key=' . $serverKey,
		        'Content-Type: application/json'
		    ];
		
		    $fcmUrl = 'https://fcm.googleapis.com/fcm/send';
			$cRequest = curl_init();
			curl_setopt($cRequest, CURLOPT_URL, $fcmUrl);
			curl_setopt($cRequest, CURLOPT_POST, true);
			curl_setopt($cRequest, CURLOPT_HTTPHEADER, $headers);
			curl_setopt($cRequest, CURLOPT_RETURNTRANSFER, true);
			curl_setopt($cRequest, CURLOPT_SSL_VERIFYPEER, false);
			curl_setopt($cRequest, CURLOPT_POSTFIELDS, json_encode($fcmNotification));
			$result = curl_exec($cRequest);
			curl_close($cRequest);
			//$result;
		}

}

?>
