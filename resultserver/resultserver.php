<?php
    require_once("testserver/ws/websockets.php");

    class ResultServer extends WebSocketServer {

        protected $results;

        protected function process($user, $message) {
            $this->processMessage($message);
        }

        protected function connected($user) {

        }

        protected function closed($user) {

        }

        protected function started() {
            $this->loadTestResults();
        }

        private function processMessage($rawjson) {
            $json = json_decode($rawjson);
            if ($json->type == "letter") {
                $this->_send($rawjson);
            } else if ($json->type == "resultreq") {
                if ($json->name == $results->loser) {
                    $o = [
                        "type" => "result",
                        "color" => "red"
                    ];
                    $this->_send(json_encode($o));
                } else {
                    $o = [
                        "type" => "result",
                        "color" => "green"
                    ];
                    $this->_send(json_encode($o));
                }
            }
        } 

        private function _send($message) {
            foreach ($this->users as $u) {
                $this->send($u, $message);
            }
        }

        private function loadTestResults() {
            $basefile = dirname(__FILE__);
            $basefile = dirname($basefile);
            $file = $basefile . "\data\defaulttest.json";
            if (file_exists($file)) {
                $test = json_decode(file_get_contents($file));
                $resultsfile = $basefile . "\data\\" . $test->name . "\\" . $test->name . "_results\results.json";
                if (file_exists($resultsfile)) {
                    $this->results = json_decode(file_get_contents($resultsfile));
                }
            }
        }
    }

    $r = new ResultServer("0.0.0.0", "5891");

    try {
        $r->run();
    } catch (Exception $e) {
        $r->stdout($e->getMessage());
    }
?>