<div class="col-sm-12 col-md-9"><!-- Start Left content -->
	<!-- start: Breadcrumb -->
	<?loadModule('breadcrumbs');?>
	<!-- /breadcrumb-->
				

<!--<div class="row">
	<div class="col-lg-3 col-sm-6 col-xs-6 col-xxs-12">
		<div class="smallstat box">
			<div class="boxchart-overlay blue">
				<div class="boxchart">
					5,6,7,2,0,4,2,4,8,2,3,3,2
				</div>
			</div>
			<span class="title">
				Patients
			</span>
			<span class="value">
				16200
			</span>
			<a href="" class="more">
				<span>
					View More
				</span>
				<i class="icon-chevron-right">
				</i>
			</a>
		</div>
	</div>
	
	<div class="col-lg-3 col-sm-6 col-xs-6 col-xxs-12">
		<div class="smallstat box">
			<div class="boxchart-overlay green">
				<div class="linechart">
					1,2,6,4,0,8,2,4,5,3,1,7,5
				</div>
			</div>
			<span class="title">
				Patients this week
			</span>
			<span class="value">
				223
			</span>
			<a href="" class="more">
				<span>
					View More
				</span>
				<i class="icon-chevron-right">
				</i>
			</a>
		</div>
	</div>

	<div class="col-lg-3 col-sm-6 col-xs-6 col-xxs-12">
		<div class="smallstat box">
			<div class="boxchart-overlay red">
				<div class="boxchart">
					5,6,7,2,0,4,2,4,8,2,3,3,2
				</div>
			</div>
			<span class="title">
				New Patients this week
			</span>
			<span class="value">
				21
			</span>
			<a href="" class="more">
				<span>
					View More
				</span>
				<i class="icon-chevron-right">
				</i>
			</a>
		</div>
	</div>

	<div class="col-lg-3 col-sm-6 col-xs-6 col-xxs-12">
		<div class="smallstat box">
			<div class="boxchart-overlay yellow">
				<div class="linechart">
					1,2,6,4,0,8,2,4,5,3,1,7,5
				</div>
			</div>
			<span class="title">
				Tasks
			</span>
			<span class="value">
				12
			</span>
			<a href="" class="more">
				<span>
					View More
				</span>
				<i class="icon-chevron-right">
				</i>
			</a>
		</div>
	</div>
	<!--/col-->
</div>-->
<!--/row-->
<div class=row>
	<a href="https://github.com/tapuz/apm/projects/1?fullscreen=true" target="_blank"><h2> Wonderering what we are working on? Follow the project here! </h2></a> 
	<img src="assets/img/apm_project.png" height="600px">
</div>



<div class="row">
	<div class="box">
	<div class="box-header"><h2>Changelog</h2></div>
	<div class="box-content">
	<table class="table">
		<thead><th>v0.3alpha</th></thead>
		<tbody
		<tr>
			<td>- Patient search module only works with patient names. Not with email, phone, address etc.. This to speed up searches</td>
		</tr>
		<tr>
			<td>- Bugfix: when book next appointment was clicked from the calendar a duplicate of the patient was created.</td>
		</tr>
		
		</tbody>
		
	</table>
	
	</div>	
		
	</div>	
	
</div>



</div>
<!--/col /left content -->
<div class="col-md-3 visible-md visible-lg" id="feed"><!-- Start Right content -->
<?
loadModule('activity_feed')?>
</div>
<!--/col /Right Content-->
</div>
<!--/row-->
<div class="modal fade" id="myModal">
<div class="modal-dialog">
<div class="modal-content">
	<div class="modal-header">
		<button type="button" class="close" data-dismiss="modal" aria-hidden="true">
			&times;
		</button>
		<h4 class="modal-title">
			Modal title
		</h4>
	</div>
	<div class="modal-body">
		<p>
			Here settings can be configured...
		</p>
	</div>
	<div class="modal-footer">
		<button type="button" class="btn btn-default" data-dismiss="modal">
			Close
		</button>
		<button type="button" class="btn btn-primary">
			Save changes
		</button>
	</div>
</div>
<!-- /.modal-content -->
</div>
<!-- /.modal-dialog -->
</div>
<!-- /.modal -->
<div class="clearfix">
</div>