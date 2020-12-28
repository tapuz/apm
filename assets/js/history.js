function toggleComplaint(complaint)
{
	var complaint = '#' + complaint.name + '_list';
	
	$(complaint).toggle();

	
}




function toggleDateSelector(element)
{
	var name = element.name;
	
	var selector = "input[name='" + name + "']:checked";
	var date_div = "#date_" + name;
	if ($(selector).val() == 'specific') {
		if( $(date_div).is(':hidden') )
    	$(date_div).toggle();
		console.log('selected');
    }
    else
    {
    	//$('#date').toggle();
    	console.log('not selected');
    if( $(date_div).is(':visible') ) {
    
    	    // it's visible, do something
    	$(date_div).toggle();   		
    	}
    }	
}

$(document).ready(function() {
	
});

