<li class="dropdown">
						<a class="btn account dropdown-toggle" data-toggle="dropdown" href="index.html">
							<div class="avatar"><img src="assets/img/face-placeholder.jpg" alt="Avatar"></div>
							<div class="user">
								<span class="hello">Logged in</span>
								<span class="name"><?=$username?></span>
							</div>
						</a>
						<ul class="dropdown-menu">
							<li><a href="index.php"><i class="icon-user"></i> Profile</a></li>
							<li><a href="index.php"><i class="icon-cog"></i> Settings</a></li>
							<li><a href="index.php"><i class="icon-envelope"></i> Messages</a></li>
							<li><a href="<?php echo wp_logout_url( $redirect_to ); ?>"><i class="icon-off"></i> Logout</a></li>
							
							
						</ul>
					</li>