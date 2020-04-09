var locale = 'nl-be';
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
	var $online = $('.online'),
        $offline = $('.offline');

        Offline.on('confirmed-down', function () {
            $('#overlay').show();
        });

        Offline.on('confirmed-up', function () {
            $('#overlay').hide();
        });
		
		Offline.options = { game: true };
	
});

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

function log(log) {
	console.log(log);
}


function glowItem(item)
{
	var item = '#' + item.id;
	
	$(item).removeClass("ui-body-c"); //remove old them
	$(item).addClass("ui-body-e"); //add new them

}

