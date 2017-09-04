<?php
    if (isset($_GET['data'])) {
        $data = $_GET['data'];
        echo file_put_contents("data/contestants.json", $data);
    }
?>