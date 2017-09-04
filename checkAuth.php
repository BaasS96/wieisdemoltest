<?php
    if (isset($_GET['name'], $_GET['pin'])) {
        $name = $_GET['name'];
        $pin = $_GET['pin'];
        if (file_exists("data/contestants.json")) {
            $data = file_get_contents("data/contestants.json");
            $data = json_decode($data);
            foreach ($data as $key => $value) {
                foreach($value as $key_ => $value_) {
                    foreach($value_ as $value__) {
                        $n = key($value__);
                        $c = $value__->$n->code;
                        if ($name == $n && $pin = $c) {
                            echo "OK";
                            exit;
                        }
                    }
                }
            }
        }
    }
    echo "FALSE";
?>