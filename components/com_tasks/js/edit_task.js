$( document ).ready(function() {
//get the comments and populate  


//make the write comment box
  var div1 = $('<div>',{class:'author'}).html('<img src="assets/img/face-placeholder.jpg" alt="avatar">');
  //var div2 = $('<div>',{class:'input-group'}).html('<textarea id="comment" required class="diss-form" placeholder="Write comment" style="overflow: hidden; word-wrap: break-word; resize: horizontal; height: 46px;"></textarea> ');
  $('<li>',{id:this.id})    
      .append(div1)
      //.append(div2)
      .append('<textarea id="comment" required class="diss-form" placeholder="Write comment" style="overflow: hidden; word-wrap: break-word; resize: horizontal; rows=3 "></textarea>')
      .append('<br><br><button disabled class="btn btn-primary add_comment submit">Comment</button>')
      .appendTo('#write_comment');

//set keyup handler for the add_comment button  
   $('#comment').on("keyup", function(){
      
      if( $(this).val().length > 0 ) {
        $('.add_comment').prop("disabled",false);
         } else {
        $('.add_comment').prop("disabled",true); 
        
       }
    
    });

//set keyup handler for the editables  
   $('.editable').on("keyup", function(){
      $(this).parent().find('.btn').html("save");
      if( $(this).val().length > 0 ) {
        $(this).parent().find('.btn').prop("disabled",false);
         } else {
           $(this).parent().find('.btn').prop("disabled",true); 
        
       }
    
    });
   
   
//set btn_save handler
   $('.btn_save').on("click", function(){
    var thevalue = $(this).parent().parent().find('.editable').val();
    var thekey = $(this).parent().parent().find('.editable').attr('id');
    var btn_save = $(this);
    console.log(thevalue);
    console.log(thekey);
    // save the new value
    $.ajax({type: "post", url: "ajax.php",
          data: { com: 'tasks',task: 'save_value', task_id : task_id, thevalue : thevalue, thekey : thekey}
            }).success(function( response ) {
                btn_save.prop("disabled",true);
                btn_save.html('saved');
                
                //refresh the task dropdown
                getTaskDropdown();
	            });
                
		
   });
    
   
   //set add_comment button handler
   $('.add_comment').on('click', function() {
    var comment = $('#comment').val();
    var timestamp = moment().format('');
   
        $.ajax({type: "post", url: "ajax.php",
          data: { com: 'tasks',task: 'add_comment', task_id : task_id, comment : comment, timestamp : timestamp,user_id:user_id}
            }).success(function( response ) {
                makeComment(getResponse(response),user_name,'Now',comment);
                $('#comment').val('');
                $('.add_comment').prop("disabled", true);
	            });
                
		
	        });
   
  
  //get the task
   $.ajax({type: "post", url: "ajax.php", dataType: "json",
          data: { com: 'tasks',task: 'get_task', task_id : task_id}
            }).success(function( task ) {
               
		        console.log(task.task);
                $('#task').val(task.task);
                $('#note').val(task.note);
                
		
	        });
  
  //get the comments  
  $('#comments').empty();
  $.ajax({type: "post", url: "ajax.php", dataType: "json",
          data: { com: 'tasks',task: 'get_comments', task_id : task_id}
            }).success(function( comments ) {
               
		        console.log(comments)
                $.each(comments, function(){
                      makeComment(this.id,this.user,this.timestamp,this.comment);
	            });
                
		
	        });
   
  
 //set the delete_comment handler
  $(".delete").live("click", function(){ 
    var e = $(this).parent();
    var comment_id = e.attr("id");
     $.ajax({type: "post", url: "ajax.php",
          data: { com: 'tasks',task: 'delete_comment', comment_id : comment_id}
            }).success(function() {
                e.remove();
            }); 
});

     
function makeComment(id,user,timestamp,comment) {
  
  var div1 = $('<div>',{class:'author'}).html('<img src="assets/img/face-placeholder.jpg" alt="avatar">');
                     var div2 = $('<div>',{class:'name'}).html(user);
                     var div3 = $('<div>',{class:'date'}).html(timestamp);
                     var div4 = $('<div>',{class:'delete'}).html('<i class="icon-remove"></i>');
                     var div5 = $('<div>',{class:'message'}).html(comment);
        
                    $('<li>',{id:id})    
                     .append(div1)
                     .append(div2)
                     .append(div3)
                     .append(div4)
                     .append(div5)
                     .appendTo('#comments');
  
  
}

});





								
										

							