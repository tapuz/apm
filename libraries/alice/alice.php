<?php
// alice lib

//include ('patient.php');


function setResponse($response) {
    echo '<div id="response">' . $response . '</div>';
}

function flipDate($date) {
		
	$day = substr($date,8,2); 
	$month = substr($date, 5,2);
	$year = substr($date,0,4);
	
	return $convertedDate=$day . '-' . $month . '-' . $year; 
		
}

function convertDateBE2ISO($my_date)
	
	{
		$day = substr($my_date, 0,2); 
		$month = substr($my_date, 3,2);
		$year = substr($my_date,6,4);
	
		return $convertedDate=$year . '-' . $month . '-' . $day; 
	}
	
function getDateFromTimestamp($timestamp){
    $timestamp = strtotime($timestamp);
    $my_date = date('d-m-Y', $timestamp);
    return $my_date;
}




function loadLib($lib) { //in wiki
	$path=ROOT . '/libraries/alice/' . $lib  . '.php';
	include_once($path);
}

function loadExtLib($lib) {
	$path=ROOT . '/libraries/'.$lib.'/' . $lib  . '.php';
	include_once($path);
}


function login($redirect_to){
	global $config;
	$url = $config['wp_root'] . $redirect_to;
	header('location:' . $url);
}

function curPageName() {
 return substr($_SERVER["SCRIPT_NAME"],strrpos($_SERVER["SCRIPT_NAME"],"/")+1);
}


function getCurrentUrl()
{
	$current_url = "http://".$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'];
	
	return $current_url;
	
}


function getVar($var)
{
	
	if (curPageName() == 'ajax.php')
	{
		if(isset($_POST[$var])) return $_POST[$var];	
		
	} else {
		if(isset($_GET[$var])) {return $_GET[$var];}else{return false;}	
		
	}
	
}


function componentOnly()
{
	$layout = getVar('layout');
	
	if ($layout == 'component'){return true;}
	
}


function getView()
{
	
	return getVar('view');
	
}

function getTask()
{
	
	return getVar('task');
	
}





function loadView() // this function is not being used...
{
	global $com; // the component to create the path to include
	
	
	if (getView()==null)
	{
		$view='default';
	} else {
		$view = getView();
	}
	
	$path = ROOT . 'components/com_'. $com .  '/views/' . $view . '.php';
	
	include($path);
	
	
	
}

function loadJS($file,$com=null) //in wiki
{
	if (curPageName() == 'ajax.php') //the JS pages do not need to be loaded on AJAX calls
	{
		return;
	}else{
		if ($com == null) // no component was specified.. load JS file from the assets/js folder
		{	$path=$config['root'] . 'assets/js/' . $file;
	
			} else { // component is specified.. load JS file from the component/js folder
				$path=$config['root'] . 'components/com_' . $com .'/js/' . $file; 
		}
	
	
	  
		$xml = sprintf("<script src='%s'></script>",$path);
		echo $xml;
    }
    
}

function loadExtJS($url){
	$xml = sprintf("<script src='%s'></script>",$url);
	echo $xml;
	
}

function loadJSCom($file,$com) // function not to be used anymore
{
	$path=$config['root'] . 'components/com_' . $com .'/js/' . $file;   
	$xml = sprintf("<script src='%s'></script>",$path);
	echo $xml;
}


function loadJSModule($file,$mod)
{
	$path=$config['root'] . 'modules/mod_' . $com .'/js/' . $file;   
	$xml = sprintf("<script src='%s'></script>",$path);
	echo $xml;
}


function loadCSS($file,$com=null) //in wiki
{
	if (curPageName() == 'ajax.php') //the css pages does not need to be loaded on AJAX calls
    {
		return;
    } else {
	if ($com == null) // no component was specified.. load CSS file from the assets/css folder
	{	$path=$config['root'] . 'assets/css/' . $file;
	
	} else { // component is specified.. load CSS file from the component/js folder
		$path=$config['root'] . 'components/com_' . $com .'/css/' . $file; 
	}
	
	
	  
		  
		$xml = sprintf("<link rel='stylesheet' href='%s'>",$path);
		echo $xml;
    }
	
	
	
}

function loadModule($module,$view=NULL)
{
	//$path='modules/mod_' . $module . '/' . $module . '.php';
	$path=ROOT . '/modules/mod_' . $module . '/' . $module . '.php';
	include($path);
	
}

function letterCount($patient_id)
{
	$query= sprintf('SELECT * from table_letters WHERE patient_id = "%s"',$patient_id);
	$letters = $wpdb->get_results($query);
	return $wpdb->num_rows;
}

function editorToolbar()
{
?>
<div id="alerts"></div>
    <div class="btn-toolbar" data-role="editor-toolbar" data-target="#editor">
      <!--<div class="btn-group">
        <a class="btn dropdown-toggle" data-toggle="dropdown" title="Font"><i class="icon-font"></i><b class="caret"></b></a>
          <ul class="dropdown-menu">
          </ul>
        </div>-->
      <div class="btn-group">
        <a class="btn dropdown-toggle" data-toggle="dropdown" title="Font Size"><i class="icon-text-height"></i>&nbsp;<b class="caret"></b></a>
          <ul class="dropdown-menu">
          <li><a data-edit="fontSize 5"><font size="5">Huge</font></a></li>
          <li><a data-edit="fontSize 3"><font size="3">Normal</font></a></li>
          <li><a data-edit="fontSize 1"><font size="1">Small</font></a></li>
          </ul>
      </div>
      <div class="btn-group">
        <a class="btn" data-edit="bold" title="Bold (Ctrl/Cmd+B)"><i class="icon-bold"></i></a>
        <a class="btn" data-edit="italic" title="Italic (Ctrl/Cmd+I)"><i class="icon-italic"></i></a>
        <a class="btn" data-edit="strikethrough" title="Strikethrough"><i class="icon-strikethrough"></i></a>
        <a class="btn" data-edit="underline" title="Underline (Ctrl/Cmd+U)"><i class="icon-underline"></i></a>
      </div>
      <div class="btn-group">
        <a class="btn" data-edit="insertunorderedlist" title="Bullet list"><i class="icon-list-ul"></i></a>
        <a class="btn" data-edit="insertorderedlist" title="Number list"><i class="icon-list-ol"></i></a>
        <a class="btn" data-edit="outdent" title="Reduce indent (Shift+Tab)"><i class="icon-indent-left"></i></a>
        <a class="btn" data-edit="indent" title="Indent (Tab)"><i class="icon-indent-right"></i></a>
      </div>
      <div class="btn-group">
        <a class="btn" data-edit="justifyleft" title="Align Left (Ctrl/Cmd+L)"><i class="icon-align-left"></i></a>
        <a class="btn" data-edit="justifycenter" title="Center (Ctrl/Cmd+E)"><i class="icon-align-center"></i></a>
        <a class="btn" data-edit="justifyright" title="Align Right (Ctrl/Cmd+R)"><i class="icon-align-right"></i></a>
        <a class="btn" data-edit="justifyfull" title="Justify (Ctrl/Cmd+J)"><i class="icon-align-justify"></i></a>
      </div>
      <div class="btn-group">
		  <a class="btn dropdown-toggle" data-toggle="dropdown" title="Hyperlink"><i class="icon-link"></i></a>
		    <div class="dropdown-menu input-append">
			    <input class="span2" placeholder="URL" type="text" data-edit="createLink"/>
			    <button class="btn" type="button">Add</button>
        </div>
        <a class="btn" data-edit="unlink" title="Remove Hyperlink"><i class="icon-cut"></i></a>

      </div>
      
      <!--<div class="btn-group">
        <a class="btn" title="Insert picture (or just drag & drop)" id="pictureBtn"><i class="icon-picture"></i></a>
        <input type="file" data-role="magic-overlay" data-target="#pictureBtn" data-edit="insertImage" />
      </div>-->
      <div class="btn-group">
        <a class="btn" data-edit="undo" title="Undo (Ctrl/Cmd+Z)"><i class="icon-undo"></i></a>
        <a class="btn" data-edit="redo" title="Redo (Ctrl/Cmd+Y)"><i class="icon-repeat"></i></a>
      </div>
      <!--<input type="text" data-edit="inserttext" id="voiceBtn" x-webkit-speech=""> -->
    </div>



<?php
}

?>