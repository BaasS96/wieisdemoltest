<?PHP
    if (isset($_GET['name'])) {
        $name = $_GET['name'];
        $save = $_GET['save'];
        $data = $_GET['data'];
        if (!file_exists("data/$name")) {
            mkdir("data/$name");
        }
    }
?>