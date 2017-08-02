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
                    header('HTTP/1.1 201 Created');
                } else {
                    header('HTTP/1.1 422 There was an error while trying to write the file. This likely means that the directory could not be found or that the filename is invalid.');
                }
            } else {
                header('HTTP/1.1 422 There was an error while trying to write the file. This likely means that the directory could not be found or that the filename is invalid.');                    
            }
        } else {
            header('HTTP/1.1 422 There was an error while trying to write the file. This likely means that the directory could not be found or that the filename is invalid.');
        }
    } else {
        header('HTTP/1.1 412 Request options were not provided.');
    }
?>