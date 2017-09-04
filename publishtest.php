<?php
    $id = 0;
    if (isset($_POST['test'])) {
        $test = $_POST['test'];
        $revision = $_POST['revision'];
        $o = [
           "name" => $test,
           "revision" => $revision    
        ];
        $c = file_get_contents("data/contestants.json");
        $c = json_decode($c);
        $newc = [];
        for ($i = 0; $i < count($c); $i++) {
            foreach ($c[$i] as $key => $value) {
                $oo = [$key => []];
                foreach ($value as $v) {
                   $vv = [$v => ["id" => nextID(), "code" => newAuthCode(3)]];
                   array_push($oo[$key], $vv);
                }
            }
            array_push($newc, $oo);
        }
        file_put_contents("data/defaulttest.json", json_encode($o));
        file_put_contents("data/test_contestants.json", json_encode($newc));
        echo json_encode($newc);
    }

    function nextID() {
        return $GLOBALS['id']++;
    }
    function newAuthCode($length = 10) {
        $characters = 'abcdefghijklmnopqrstuvwxyz';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }
        return $randomString;
    }
?>