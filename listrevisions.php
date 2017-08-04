<?php
    if (isset($_GET['test'])) {
        $test = $_GET['test'];
        if (is_dir("data\\$test")) {
            $dates = array();
            $conts = scandir("data\\$test");
            $revisions = array_diff($conts, array("..", "."));
            foreach ($revisions as $val) {
                $woext = explode(".", $val);
                $date = explode('-', $woext[0])[1];
                array_push($dates, $date);
            }
            header("Content-Type: application/json");
            echo json_encode($dates);
        }
    }
?>