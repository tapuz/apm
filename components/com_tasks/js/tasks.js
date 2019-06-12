$( document ).ready(function() {
        
    	//$('.datatable').dataTable({ 
		//"sDom": "<'row'<'col-lg-6'l><'col-lg-6'f>r>t<'row'<'col-lg-12'i><'col-lg-12 center'p>>",
		//"bPaginate": false,
		//"bFilter": false,
		//"bLengthChange": false,
		//"bInfo": false,
       // "aaSorting": []
       // });
	
    
    
    
     
      $('.tasks').on("click", ".edit_task", function() {   
        var task_id = $(this).attr('task_id');
        url = 'index.php?com=tasks&view=edit_task&task_id=' + task_id;
        
        $(this).attr("href", url);
        
     });
     
     
     $('.tasks').on("click", ".complete_task", function() {   
        var task_id = $(this).attr('task_id');
        
        $.ajax({type: "post", url: "ajax.php",
          data: { com: 'tasks',task: 'toggle_status',task_id : task_id}
            }).success(function() {
        		 $('#' + task_id + ' .task').toggleClass('task_completed');
                 getTaskDropdown();
       
        	});
        
        
     });
     
     
        $('.tasks').on("click", ".archive_task", function() {   
        var task_id = $(this).attr('task_id');
        
        bootbox.confirm("Are you sure you want to archive this task?", function(result) {
		if (result === true) // delete the letter from db
		{
			
										
			$.ajax({
  			type: "post",
		    url: "ajax.php",
  			data: { com: 'tasks',task: 'archive_task',task_id : task_id}
			}).success(function( response ) {
                    var n = new Noty({text: 'Task archived',theme:'sunset',type: 'success',layout:'topCenter',timeout:2000});
                    n.show();
					$('#' + task_id).remove();
                    getTaskDropdown();
		  	});
		}
        
        });
      });
	
    
     $('.goto_task').on('click',function() {
      
     //$('.tasks').on("click", ".edit_task", function() {   
        var task_id = $(this).attr('task_id');
        url = 'index.php?com=tasks&view=edit_task&task_id=' + task_id;
        
        $(this).attr("href", url);
        
     });
    	
		
  }); //end document ready function


$.jStorage.deleteKey("users");
var selectUsers;
// get all the users
 $.ajax({type: "post", url: "ajax.php", dataType: "json",
          data: { com: 'tasks',task: 'get_users'}
            }).success(function( data ) {
               
		        $.jStorage.set("users",data);
		        
		        var users = $.jStorage.get("users");
                
                
                default_user_id = $('#user_id').val();
                // make the practitioner selector and select the active practitioner as defaultvalue
    
                 selectUsers = "<select id='users' name='users' class='form-control'>"
                $.each(users, function(){
                if (this.data["ID"] == default_user_id){ //set this value as selected 
                        selectUsers += "<option value=" + this.data["ID"]  + " selected>" + this.data["display_name"] + "</option>";
                    } else {
                        selectUsers += "<option value=" + this.data["ID"]  + ">" + this.data["display_name"]  + "</option>";        
                    }
					
	            });
                selectUsers += "</select>";
    
		
	        });



function addTask()
{
    
    bootbox.dialog({
                title: "<strong>Create task</strong>"   ,
                message: '<div class="row">  ' +  
                    '<div class="col-md-12"> ' + 
                    '<form class="form-horizontal"> ' +
                    '<div class="form-group"> ' +
                    '<label class="col-md-4 control-label" for="user">Assign to</label> ' +
                    '<div class="col-md-6"> ' +
                    selectUsers +
                    '</div> ' +
                    '</div> ' +
                    '<div class="form-group"> ' +
        
                    '<label class="col-md-4 control-label" for="task">Task</label> ' +
                    '<div class="col-md-6"> ' +
                    '<input id="task" name="task" type="text" placeholder="Task" class="form-control input-md"> ' +
                    '</div> ' +
                    '</div> ' +
        
                    '<label class="col-md-4 control-label" for="note">Note</label> ' +
                    '<div class="form-group"> ' +
                    '<div class="col-md-6"> ' +
                    '<textarea id="note" class="form-control" rows="5" placeholder="" required></textarea>' +
                   '</div></div> ' +
                   
                    '</form> </div>  </div>',
                buttons: {
                    success: {
                        label: "Add task",
                        className: "btn-success",
                        callback: function () {
                            var task = $('#task').val();
                            var note = $('#note').val();
                            var assigned_to_id = $("#users").val();
							var creator_id = $('#user_id').val();
                            
                            //make the ajax call 
                            
                            $.ajax({
  			                    type: "post",
		                        url: "ajax.php",
                                dataType: "json",
  			                    data: { com: 'tasks', 
  					                    task: 'add_task',  
  					                    assigned_to_id: assigned_to_id,
										creator_id : creator_id,
  					                    taskname: task,  //do not change taskname into task, see 2 lines above!!!
  					                    note: note}
  					                    
			                    }).success(function( data ) {
                                  console.log (data);
                                  console.log (data.task_id);
				                    
					                //var n = noty({text: 'Task added!' ,type: 'success',layout:'topCenter'});
                                    if (creator_id == assigned_to_id){  // it is a self assigned task    
                                        var html = '<tr id="'+data.task_id+'">' 
										        +'<td class="task">' + data.task + '</td>' 
                                                +'<td>' + data.note + '</td>'
                                                +'<td>' + data.creator + '</td>' 
                                                +'<td style="white-space: nowrap">' 
                                                +        '<a class="btn btn-success complete_task glyphicon glyphicon-ok" task_id="'+data.task_id+'"></a>'
                                                +        '<a class="btn btn-primary edit_task glyphicon glyphicon-edit" task_id="'+data.task_id+'"></a>'
                                                +        '<a class="btn btn-danger archive_task glyphicon glyphicon-folder-open" task_id="'+data.task_id+'"></a>'
                                                
                                                
                                                
						
                                                +'</td>'
                                        $("#table_tasks_for_user tr:last").after(html);
                                    
                                                
                                    }else{ // it is not a self assigned task
                                    
                                        var html = '<tr id="'+data.task_id+'">' 
										        +'<td class="task">' + data.task + '</td>' 
                                                +'<td>' + data.note + '</td>'
                                                +'<td>' + data.assigned + '</td>'
                                                +'<td style="white-space: nowrap">' 
                                                +        '<a class="btn btn-success complete_task glyphicon glyphicon-ok" task_id="'+data.task_id+'"></a>'
                                                +        '<a class="btn btn-primary edit_task glyphicon glyphicon-edit" task_id="'+data.task_id+'"></a>'
                                                +        '<a class="btn btn-danger archive_task glyphicon glyphicon-folder-open" task_id="'+data.task_id+'"></a>'
                                                
                                                
                                                
						
                                                +'</td>' 
                                                +'</tr>';
                                        $("#table_tasks_by_user tr:last").after(html);
                                    
                                    }
                                    
                                 getTaskDropdown();   
			                });
                            
                            
                            
                        }
                    }
                }
            }
        );
    
    
}