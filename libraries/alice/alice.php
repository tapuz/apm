<?php
// alice lib

//include ('patient.php');
function searchObjectInArrayByProperty($array, $property, $value) {
    foreach ($array as $item) {
        if (isset($item->$property) && $item->$property == $value) {
            return $item; // Found a matching object
        }
    }
    return null; // Object with the specified property not found
}



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
		return date("Y-m-d",strtotime(str_replace("/", ".", $my_date)));
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
		if (AJAXmode == 'POST'){
			if(isset($_POST[$var])) return $_POST[$var];	
		}
		if (AJAXmode == 'GET'){
			if(isset($_GET[$var])) {return $_GET[$var];}	
		}
		
		
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
	global $v;
	if (curPageName() == 'ajax.php') //the JS pages do not need to be loaded on AJAX calls
	{
		return;
	}else{
		if ($com == null) // no component was specified.. load JS file from the assets/js folder
		{	$path=$config['root'] . 'assets/js/' . $file . '?v='.$v;
	
			} else { // component is specified.. load JS file from the component/js folder
				$path=$config['root'] . 'components/com_' . $com .'/js/' . $file . '?v='.$v; 
		}
	
	
	  
		$xml = sprintf("<script src='%s'></script>",$path);
		echo $xml;
    }
    
}

function loadExtJS($url){
	if (curPageName() == 'ajax.php') //the JS pages do not need to be loaded on AJAX calls
	{
		return;
	}else{
		$xml = sprintf("<script src='%s'></script>",$url);
		echo $xml;	
    }
	
	
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
	global $v;
	if (curPageName() == 'ajax.php') //the css pages does not need to be loaded on AJAX calls
    {
		return;
    } else {
	if ($com == null) // no component was specified.. load CSS file from the assets/css folder
	{	$path=$config['root'] . 'assets/css/' . $file . '?v='.$v;
	
	} else { // component is specified.. load CSS file from the component/js folder
		$path=$config['root'] . 'components/com_' . $com .'/css/' . $file . '?v='.$v; 
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
<span class="ql-formats">
      <select class="ql-font"></select>
      <select class="ql-size"></select>
    </span>
    <span class="ql-formats">
      <button class="ql-bold"></button>
      <button class="ql-italic"></button>
      <button class="ql-underline"></button>
      <button class="ql-strike"></button>
    </span>
    <span class="ql-formats">
      <select class="ql-color"></select>
      <select class="ql-background"></select>
    </span>
    <span class="ql-formats">
      <button class="ql-script" value="sub"></button>
      <button class="ql-script" value="super"></button>
    </span>

    <span class="ql-formats">
      <button class="ql-list" value="ordered"></button>
      <button class="ql-list" value="bullet"></button>
      <button class="ql-indent" value="-1"></button>
      <button class="ql-indent" value="+1"></button>
    </span>
    <span class="ql-formats">
      <button class="ql-direction" value="rtl"></button>
      <select class="ql-align"></select>
    </span>
    
    <span class="ql-formats">
      <button class="ql-clean"></button>
    </span>



<?php
}

?>