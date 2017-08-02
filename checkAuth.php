<?php
    if (isset($_GET['name'], $_GET['pin'], $_GET['test'])) {
        $name = $_GET['name'];
        $pin = $_GET['pin'];
        $test = $_GET['test'];
        if (is_dir("data\\$test")) {
            $json = json_decode(file_get_contents("data\\$test\contestants.json"));
            if (array_key_exists($name, $json)) {
                if ($json[$name] == $pin) {
                    //We're good
                    echo "";
                } else {
                    goto error;
                }
            } else {
                goto error;
            }
        } else {
            goto error;
        }
    } else {
        goto error;
    }
    error:
    echo "error";
?>