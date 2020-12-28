
	
	/* ---------- Datable ---------- */
	$('.datatable').dataTable({
		"sDom": "<'row'<'col-lg-6'l><'col-lg-6'f>r>t<'row'<'col-lg-12'i><'col-lg-12 center'p>>",
		"bPaginate": false,
		"bFilter": false,
		"bLengthChange": false,
		"bInfo": false
	});
	
	/* ---------- Progress Bars ---------- */
	$(".simpleProgress").each(function(){
		
		var value = parseInt($(this).html());
				
		$(this).progressbar({
			value: value
		});
		
	});
	
	
	
	
	