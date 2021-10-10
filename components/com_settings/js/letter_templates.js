$(function() {
    var options = {
		modules: {
		  toolbar: '#toolbar'
		},
		placeholder: 'Create a template...make use of the fields on the right side..',
		theme: 'snow'
	  };
	  var editor = new Quill('#editor', options);
	  try{
		editor.setContents(JSON.parse(template.template));
		} catch (error) {
  
		}
	   
      
      
      $("#btn_save_template" ).click(function() {
    	template.template = JSON.stringify(editor.getContents());
        var template_name = $("#template_name").val();
		setSaveStatus('saving');
  		$.ajax({
  			type: "post",
		    url: "ajax.php",
  			data: { com:'settings',
  					task:'save_template',
  					template_id: template.id, 
  					template_name: template_name, 
  					template: template.template }
			}).done(function() {
                setSaveStatus('saved');
			});
  
	});
      
});