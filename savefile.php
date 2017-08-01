<?PHP
    if (isset($_GET['name'])) {
        $name = $_GET['name'];
        $save = $_GET['save'];
        $data = $_GET['data'];
        if (!is_dir("data\\$name")) {
            mkdir("data\\$name");
        }
        $file = "data\\$name\\$name" . "-" . "$save.json";
        if ($fp = fopen($file, "w")) {
            if (fwrite($fp, $data)) {
                if (fclose($fp)) {
                    echo "true";
                } else {
                    echo "error";
                }
            } else {
                echo "error"; 
            }
        } else {
            echo "error";
        }
    }
?>