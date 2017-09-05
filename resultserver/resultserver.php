<?php
    require_once("testserver/ws/websockets.php");

    class ResultServer extends WebSocketServer {

        protected function process($user, $message) {
            $this->stdout($message);
            
        }

        protected function connected($user) {

        }

        protected function closed($user) {

        }

        protected function started() {
            
        }

        private function processMessage($rawjson) {
            $json = json_decode($rawjson);
            if ($json->type == "letter") {
                $this->_send($rawjson);
            }
        } 

        private function _send($message) {
            foreach ($this->users as $u) {
                $this->send($u, $message);
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