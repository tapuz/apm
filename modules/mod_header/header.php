	<header class="navbar">
		<div class="container">
			<button class="navbar-toggle" type="button" data-toggle="collapse" data-target=".sidebar-nav.nav-collapse">
			      <span class="icon-bar"></span>
			      <span class="icon-bar"></span>
			      <span class="icon-bar"></span>
			</button>
			<a id="main-menu-toggle" class="hidden-xs open"><i class="icon-reorder"></i></a>		
			<a class="navbar-brand col-md-2 col-sm-1 col-xs-2" href=""><span>TIMEGENICS</span></a>
			<!--Start: Search -->
			<div id="search" class="col-sm-5 col-xs-8 col-lg-3">
				<?//loadModule('search');?>
			<!--/search -->	
			</div>
			
			<!-- start: Header Menu -->
			<div class="nav-no-collapse header-nav">
			<!--<div id="menu-navbar" class="col-sm-5 col-xs-8 col-lg-3">
				<ul class="nav navbar-nav">
				
					<li><a class="btn-large"><i class="icon-desktop"></i>&nbsp;&nbsp;Dashboard</a></li>
					<li><a class="btn-large"><i class="icon-male"></i>&nbsp;&nbsp;Patients</a></li>
					<li><a class="btn-large"><i class="icon-calendar"></i>&nbsp;&nbsp;Calendar</a></li>
					<li><a class="btn-large"><i class="icon-cog"></i>&nbsp;&nbsp;Settings</a></li>
					
				</ul>
			</div>-->
				<ul class="nav navbar-nav pull-right">
					<li class="version"><?echo VERSION?></li>
			
					<!--Start notification Dropdown -->
						<?if (current_user_can('debug'))
						{?>
							
						<li class="dropdown hidden-xs">
						<a class="btn"  href="index.php?com=debug&view=default">
							<i class="fa fa-bug"></i>
							
						</a>
						
					</li>	
							
							
						<?	
						}
						?>
						<?//loadModule('notifications');?>
					
					<!-- end Notification Dropdown-->
					<!-- start: Tasks Dropdown -->
						<?loadModule('tasks');?>
					<!-- end: Tasks Dropdown -->
					<!-- start: Message Dropdown -->
						<?//loadModule('messages');?>
					<!-- end: Message Dropdown -->
					<!-- <li>
						<a class="btn" href="index.html#">
							<i class="icon-wrench"></i>
						</a>
					</li> -->
					<!-- start: User Dropdown -->
						<?loadModule('user','dropdown')?>
					<!-- end: User Dropdown -->
						
				</ul>
			</div>
			<!-- end: Header Menu -->
			
		</div>	
	</header>