<?php
/**
 * Select the payments you want to view
 * 
 * 
 **/ 

?>
<div class="col-sm-12 col-md-9"><!-- Start Left content -->
	
	
	
<div class="row">&nbsp;</div>

<div class="row">
	<div class="col-md-10">
	       	
   		<div class="box">
			<div class="box-header">
				<h2><i class="icon-reorder"></i><span class="break"></span>Payments received today</h2>
                
			</div>
			
			<div class="box-content">
            <div class="form-group">
                <label for="sel1">Select doctor:</label>
                <select class="form-control" id="practitioner">
                    <?php foreach ($practitioners as $practitioner) {
                        echo '<option value='.$practitioner->ID.'>' . $practitioner->display_name . '</option>'; 
                    } 
                    ?>
                    
                </select>
            </div>
			<div class="form-group">
                <label for="sel1">Select clinic:</label>
                <select class="form-control" id="clinic">
                    <?php foreach ($clinics as $clinic) {
                        echo '<option value='.$clinic->clinic_id.'>' . $clinic->clinic_name . '</option>'; 
                    } 
                    ?>
                    
                </select>
            </div>
            
            <div class="form-group">
            	<label for="date">Datum:</label>	
	 			<input type="text" class="form-control date-picker" id="date" data-date-format="dd/mm/yyyy"/>
	 		</div>	
	 			
            
			<div>
				<button type="button" class="btn btn-primary btn_load_summary">Load summary</button>
			</div>
            <div class="row">&nbsp;</div>        
			<div class="payment_summary">
				
			</div>
        		
   			</div>
   		</div>
   	</div><!--/col -->
   
</div><!--/row -->



</div><!--/col /left content -->

<div class="col-md-3 visible-md visible-lg" id="feed"><!-- Start Right content -->
		
</div><!--/col /Right Content-->
	
</div><!--/row-->

 		
<!--load the Templates-->

<?php include(TEMPLATES . 'payment_summary.html'); ?>
			

				



