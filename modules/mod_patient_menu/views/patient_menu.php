	<h2>Patient Menu</h2>
						<ul class="nav main-menu">
						<li><a href="index.php?com=patient&view=patient&patient_id=<?=$patient_id?>"><i class="icon-user"></i><span class="hidden-sm text"> Details</span></a></li>
						<li><a href="index.php?com=educate&view=educate&layout=component&patient_id=<?=$patient_id?>"><i class="fa fa-graduation-cap"></i><span class="hidden-sm text"> Educate</span></a></li>
						<li><a href="index.php?com=pictureproof&layout=component&view=pictureproof&patient_id=<?=$patient_id?>"><i class="fa fa-camera"></i><span class="hidden-sm text"> PictureProof</span></a></li>
						<li><a href="index.php?com=portfolio&layout=component&view=portfolio&patient_id=<?=$patient_id?>"><i class="far fa-folder-open"></i><span class="hidden-sm text"> Portfolio</span></a></li>
						<li><a href="index.php?com=letter&view=list&patient_id=<?=$patient_id?>"><i class="icon-file-alt"></i><span class="hidden-sm text"> Letters </span><span class="badge"></span></a></li>	
						<li><a href="index.php?com=invoice&view=list&patient_id=<?=$patient_id?>"><i class="icon-money"></i><span class="hidden-sm text"> Invoices</span></a></li>
						
						
					
					
						
						
					</ul>
					<br>
					<div class="btn-group btn-group-justified" role="group">
        				<a class="btn btn-success sendEmail" role="button">Send message</a>
    				</div>
					<br>
					
				
					<input id="patient_name" type="hidden" value="<?= $patient->patient_surname.' '.$patient->patient_firstname?>">
					<input id="patient_email" type="hidden" value="<?= $patient->email;?>">
					<input id="patient_address" type="hidden" value="<?= $patient->address;?>">
					<input id="patient_postcode" type="hidden" value="<?= $patient->postcode;?>">
					<input id="patient_city" type="hidden" value="<?= $patient->city;?>">
					<input id="patient_country" type="hidden" value="<?= $patient->country;?>">
					<input id="patient_phone" type="hidden" value="<?= $patient->phone;?>">
					
				
					
					
					<p></p>
					
					
	<h2>Upcoming Appointments</h2>
	<ul>
		
		
	</ul>
	
	