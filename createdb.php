<?PHP
$filename = "data/testdata.db";
$newdb = new SQLite3($filename);
	$newdb->exec("CREATE TABLE users (userid INTEGER PRIMARY KEY, name TEXT, score INTEGER, jokers INTEGER)");
	echo 'data inserted';
	exit();
	//$newdb->exec("INSERT INTO users (id,password,whitepackages,orangepackages,joker,timeout,shoddy,cdtime,started) VALUES ('$encrypID', '$encrypPW', '$whitepackages', '$orangepackages', $chance[0], $timeout, $shoddy, $cdtimestamp, 0)");
?>
