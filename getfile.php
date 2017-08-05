<?php
    if (isset($_GET['file'], $_GET['revision'])) {
        $file = $_GET['file'];
        $rev = $_GET['revision'];
        if (is_dir("data\\$file")) {
            $files = array_diff(scandir("data\\$file"), array("..", "."));
            if (count($files) > 0) {
                if ($rev == "LATEST") {
                    $latesfile = "";
                    if (count($files > 1)) {
                        $latestfiletime = 0;
                        foreach ($files as $val) {
                            $fn = "data\\$file\\$val";
                            if (filemtime($fn) > $latestfiletime) {
                                $latestfiletime = filemtime($fn);
                                $latesfile = $val;
                            }
                        }
                    } else {
                        $latesfile = $files[0];
                    }
                    header("Content-Type: application/json");
                    $json = file_get_contents("data\\$file\\$latesfile");
                    $woext = explode(".", $latesfile);
                    $date = explode('-', $woext[0])[1];
                    $arr = [
                        "rev" => $date,
                        "data" => $json
                    ];
                    echo json_encode($arr);
                } else {
                    $rev = str_replace(".", "_", $rev);
                    $rev = str_replace(":", "_", $rev);
                    $rev = str_replace("-", "_", $rev);
                    $fn = $file . "-" . $rev . ".json";
                    if (file_exists("data\\$file\\$fn")) {
                        header("Content-Type: application/json");
                        $json = file_get_contents("data\\$file\\$fn");
                        $woext = explode(".", $fn);
                        $date = explode('-', $woext[0])[1];
                        $arr = [
                            "rev" => $date,
                            "data" => $json
                        ];
                        echo json_encode($arr);
                    }
                }
            } else {
                header("HTTP/1.1 404 Not Found");
            }
        } else {
            header('HTTP/1.1 404 Not Found');
        }
    } else {
        header('HTTP/1.1 412 Request options were not provided.');
    }
?>