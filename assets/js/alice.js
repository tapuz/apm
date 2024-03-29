var locale = 'nl-be';
var saveNoty = new Noty({
    text: '<span class="text-center">Saving...</span>',
    layout:'bottomRight',
    theme:'sunset',
    type:'success',
    speed: 0,
    callbacks: {afterClose: function() {}}
    });

//$(window).on('load',function() {
  // Animate loader off screen
//  $(".preloader").fadeOut("slow");;
//});

$(function() {
	//set the Moment.js locale
	moment.locale(locale);
	
    $( "#btn_back" ).click(function() {
    	//if (!PreviousUrl == null) // set the back button
    		window.location= PreviousUrl;  
	});
    
    //populate the task dropdown
    getTaskDropdown();
	
	
	//
/* 	var $online = $('.online'),
        $offline = $('.offline');

        Offline.on('confirmed-down', function () {
            $('#overlay').show();
        });

        Offline.on('confirmed-up', function () {
            $('#overlay').hide();
        });
		
		Offline.options = { game: true };
		
	 */
	 
	 //periodically check if user is still logged in
function checkLoginStatus() {
  const intervalId = setInterval(() => {
    // Check if the user is still logged in
    $.ajax({
        //type: "post", 
        url: "api.php", 
        dataType: "json",
        data: {task: 'isUserLoggedIn',redirectUrl:window.location.href},
        success: function( data ) {
		        	//log('logged in status: ' + data);
                    //data = JSON.parse(data);  
		    		if (data.isUserLoggedIn == true) {
				      // Store the current page URL in session storage
				      
				      log('ok');
					  // Redirect the user to the login page
				      
				      // Stop the periodic check
				      //clearInterval(intervalId);
		    		} else {
		    			window.location.href = data.loginUrl;	
		    		}   	
          		}  
       });
    
    
  },15000); // Check every 30 seconds
}



checkLoginStatus();

	 
	 
	 
});

function log(log) {
	console.log(log);
}

function showConfirm(msg){
    var deferred = $.Deferred();
    bootbox.confirm({
      message: msg,
      buttons: {
        cancel: {
          label: 'No',
          className: 'btn-primary'
        },
        confirm: {
          label: 'Yes',
          className: 'btn-primary'
        }

      },
      callback: function(result) {
        deferred.resolve(result);
        
      }
    });

    return deferred.promise();
 }

function showLoadingScreen(){
    $('.loadingscreen').show();
}
function hideLoadingScreen(){
    $('.loadingscreen').fadeOut('slow');
}


function setSaveStatus(status) {
    
    switch (status){
        case 'saving':
            saveNoty.show();
        break;
        case 'saved':
            saveNoty.close();
            savedNoty = new Noty({
                text: '<span class="text-center">Saved!</span>',
                layout:'bottomRight',
                theme:'sunset',
                type:'success',
                speed: 0,
                timeout: 1000,
                callbacks: {afterClose: function() {}}
                }).show();
        break;
    }
    
    
    
}


function hexToRGBA(hex, opacity) {
    return 'rgba(' + (hex = hex.replace('#', '')).match(new RegExp('(.{' + hex.length/3 + '})', 'g')).map(function(l) { return parseInt(hex.length%2 ? l+l : l, 16) }).concat(opacity||1).join(',') + ')';
}

function insertAtCursor(elementID,text){
    document.getElementById(elementID).focus() ; // DIV with cursor is 'myInstance1' (Editable DIV)
    var sel, range;
    
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();
            
            var lines = text.replace("\r\n", "\n").split("\n");
            var frag = document.createDocumentFragment();
            for (var i = 0, len = lines.length; i < len; ++i) {
                if (i > 0) {
                    frag.appendChild( document.createElement("br") );
                }
                frag.appendChild( document.createTextNode(lines[i]) );
            }

            range.insertNode(frag);
        }
    } else if (document.selection && document.selection.createRange) {
        document.selection.createRange().text = text;
    }
    sel.removeAllRanges();
    
}


/**
 * getResponse() function 
 * Filters the response from the ajax call
 * 
**/
function getResponse(response){
    return $(response).filter('#response').text();
}

/**
 * getTaskDropdown() function 
 * update the task dropdown when a new task is created/modified/deleted
 * 
**/



function getTaskDropdown() {
    $.ajax({
        type: "post", 
        url: "ajax.php", 
        dataType: "json",
        data: { com: 'tasks',task: 'get_tasks'},
        success: function( data ) {
            $('#dropdown_menu_task_count').html(data.length);
            var dropdown = $('#dropdown_menu_tasks');
            dropdown.empty();
            $('<span>',{class:'dropdown-menu-title'}).html('You have '+ data.length +' tasks in progress').appendTo(dropdown);
            
            $.each(data, function(){
             header = $('<span>',{class:"header"});
             title =  $('<span>',{class:"title"}).html(this.task);
             a = $('<a>',{ href:"index.php?com=tasks&view=edit_task&task_id=" + this.task_id});
             e= header.append(title);  
             a.append(e);
             $('<li>').append(a).appendTo(dropdown);
           });		
          footer = $('<a>',{class:"dropdown-menu-sub-footer",href:"index.php?com=tasks&view=list"}).html('View all tasks');
          $('<li>')
          .append(footer)
          .appendTo(dropdown);
       }
            
});

}



//console.log(PreviousUrl);



var PreviousUrl = document.URL;

//console.log(PreviousUrl);



function glowItem(item)
{
	var item = '#' + item.id;
	
	$(item).removeClass("ui-body-c"); //remove old them
	$(item).addClass("ui-body-e"); //add new them

}

