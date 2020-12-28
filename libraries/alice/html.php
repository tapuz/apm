<?php

/**
 * HTML - PHP Class for html output
 * 
 * 
 * 
 * 
 * @name				HTML
 *  	
 * @version 			1 alpha (15/03/2011)
 * 
 * @author 				Thierry Duhameeuw
 * 
 * @uses 				
 * 
 * @todo 				
 *
 *
 * 
 * 
 */

class html {
	
public function h($heading,$heading_title=NULL)
{
	return $xml=sprintf('<h%s>%s</h%s>',$heading,$heading_title,$heading);
}

public function input_button($id=NULL,$value=NULL,$event=NULL,$action=NULL,$class='button',$disabled=NULL)
{
	return $xml=sprintf('<input type="button" id="%s" value="%s" %s="%s" class="%s" %s>',$id,$value,$event,$action,$class,$disabled);
}

public function input_text($id=NULL,$value=NULL,$placeholder=NULL,$event=NULL,$action=NULL,$class=NULL,$disabled=NULL)
{
	return $xml=sprintf('<input type="text" id="%s" value="%s" placeholder="%s" %s="%s" class="%s" %s>',$id,$value,$placeholder,$event,$action,$class,$disabled);
}

public function input_search($id=NULL,$placeholder=NULL,$value=NULL,$size=NULL,$maxlength=NULL,$event=NULL,$action=NULL)
{
	return sprintf('<input type="search" results="10" id="%s" placeholder="%s" value="%s" size="%s" maxlength="%s" %s="%s">',$id,$placeholder,$value,$size,$maxlength,$event,$action);
}

public function iframe($id,$src)
{
	$html="<iframe id=\"$id\" name=\"$id\" src=\"$src\" height=\"100%\" width=\"100%\" border=\"0\"></iframe>";
	echo $html;
}


public function whiteLine($n)
{
	echo $n;
	for ($i=0;$i<=$n;$i++)
	{
		echo $i;
		return "<BR>\n";
	}
}


public function div_start($id=NULL,$class=NULL,$style=NULL,$event=NULL,$action=NULL)
{
	if(!isset($class)){$class='';}
	//$html=sprintf("<div id=\"%s\" class=\"%s\" style=\"%s\">\n",$id,$class,$style);
	$xml=sprintf('<div id="%s" class="%s" style="%s" %s="%s">',$id,$class,$style,$event,$action);
	return $xml;
}

public function div_stop()
{
	$xml="</div>\n";
	return $xml;
}

public function input_hidden($id,$value=NULL)
{
	return sprintf('<input type="hidden" id="%s" value="%s">',$id,$value);
}

public function input_select($name,$array_selectValueDescription,$defaultValue)
{
	$xml=sprintf("<select name='%s'>\n",$name);
	foreach ($array_selectValueDescription as $key => $value) 
		{
			$selected='';
 			if($key==$defaultValue){$selected='selected';};
			$xml .= sprintf("<option value='%s' %s>%s</option>\n",
					$key,
					$selected,
					$value);
		}
			
	$xml.="</select>";
	return $xml;
}


}


?>






