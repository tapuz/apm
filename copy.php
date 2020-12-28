<?

try {
    exec('mysqldump --user=c2dev --password=devdev2016!!??&& --host=dev.rugcentrumgent.be c2www_rugcentrumgent_be > dump.sql');
} catch (Exception $e) {
    echo 'Caught exception: ',  $e->getMessage(), "\n";
}
echo 'did the trick';




?>