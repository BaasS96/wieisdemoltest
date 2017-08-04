<?php
    header("Content-Type: application/json");
    $files = scandir("data");
    $dirs = array();
    foreach ($files as $value) {
        if (is_dir("data\\$value") && ($value != "." && $value != "..")) {
            $conts = scandir("data\\$value");
            $revisions = array_diff($conts, array("..", "."));
            $dirs[$value] = count($revisions);
        }
    }
    echo json_encode($dirs);
?>