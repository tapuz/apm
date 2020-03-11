<?$view_title='Settings - General'?>

<div class="col-sm-12 col-md-9"><!-- Start Left content -->
	
	<!-- start: Breadcrumb -->
	<?loadModule('view_title');?>
	<!-- /breadcrumb-->
	
	<div class="row">
	
	<H3>General Setting</H3>   
											
										    
	<?
	
	if ( current_user_can('add_payment_for_all_practitioners') ) {
    echo 'The current user can add payments for all practitioners';
    }
	
	
	?>
									
	
	</div><!--/row-->

	<div class="row">
	<table class="working-plan table table-striped">
                            <thead>
                                <tr>
                                    <th>Day</th>
                                    <th>Start</th>
                                    <th>End</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <div class="checkbox">
                                            <label>
                                                <input type="checkbox" id="monday">
                                                    Monday                                            </label>
                                        </div>
                                    </td>
                                    <td><input type="text" id="monday-start" class="work-start hasDatepicker"></td>
                                    <td><input type="text" id="monday-end" class="work-end hasDatepicker"></td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="checkbox">
                                            <label>
                                                <input type="checkbox" id="tuesday">
                                                    Tuesday                                            </label>
                                        </div>
                                    </td>
                                    <td><input type="text" id="tuesday-start" class="work-start hasDatepicker"></td>
                                    <td><input type="text" id="tuesday-end" class="work-end hasDatepicker"></td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="checkbox">
                                            <label>
                                                <input type="checkbox" id="wednesday">
                                                    Wednesday                                            </label>
                                        </div>
                                    </td>
                                    <td><input type="text" id="wednesday-start" class="work-start hasDatepicker"></td>
                                    <td><input type="text" id="wednesday-end" class="work-end hasDatepicker"></td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="checkbox">
                                            <label>
                                                <input type="checkbox" id="thursday">
                                                    Thursday                                            </label>
                                        </div>
                                    </td>
                                    <td><input type="text" id="thursday-start" class="work-start hasDatepicker"></td>
                                    <td><input type="text" id="thursday-end" class="work-end hasDatepicker"></td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="checkbox">
                                            <label>
                                                <input type="checkbox" id="friday">
                                                    Friday                                            </label>
                                        </div>
                                    </td>
                                    <td><input type="text" id="friday-start" class="work-start hasDatepicker"></td>
                                    <td><input type="text" id="friday-end" class="work-end hasDatepicker"></td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="checkbox">
                                            <label>
                                                <input type="checkbox" id="saturday">
                                                    Saturday                                            </label>
                                        </div>
                                    </td>
                                    <td><input type="text" id="saturday-start" class="work-start hasDatepicker"></td>
                                    <td><input type="text" id="saturday-end" class="work-end hasDatepicker"></td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="checkbox">
                                            <label>
                                                <input type="checkbox" id="sunday">
                                                    Sunday                                            </label>
                                        </div>
                                    </td>
                                    <td><input type="text" id="sunday-start" class="work-start hasDatepicker"></td>
                                    <td><input type="text" id="sunday-end" class="work-end hasDatepicker"></td>
                                </tr>
                            </tbody>
                        </table>
	</div>

</div><!--/col /left content -->

<div class="col-md-3 visible-md visible-lg" id="feed"><!-- Start Right content -->
	<?loadModule('settings_menu');?>
	

</div><!--/col /Right Content-->

</div><!--/row-->

