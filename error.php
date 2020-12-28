<style>
    body {
    background-color: black;
    color:white;
    font-weight: normal;
    font-size: 1em;
    }
    
    
</style>


<?php
$page = $_SERVER['PHP_SELF'];
$sec = "1";
?>
<html bgcolor="black">
    <head>
    <title>Error Log</title>
    <meta http-equiv="refresh" content="<?php echo $sec?>;URL='<?php echo $page?>'">
    </head>
    <body>
        <pre>
<?php
$file = 'error.log';

$fp = fopen($file, 'r');

if ($fp) {
$lines = array();

while (($line = fgets($fp)) !== false) {
$lines[] = $line;

while (count($lines) > 40)
array_shift($lines);
}

foreach ($lines as $line) {
print $line;
}

fclose($fp);
}
?>
</pre>    
    </body>
</html>

