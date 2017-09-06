<?php
    require_once("ws/websockets.php");
    require_once("testhandler.php");
    class TestServer extends WebsocketServer {

        protected $handler;
        public $status = 0; //Starting

        function __constructor() {
        }

        protected function process($user, $message) {
            if ($this->status != 0) {
                $json = json_decode($message);
                var_dump($json);
                if ($json->type == "starttest") {
                    $this->handler->sendNextQuestion($user);
                } else if ($json->type == "answer") {
                    $this->handler->processAnswer($user, $json->index);
                }
            }
        }

        protected function connected($user) {

        }

        protected function closed($user) {
            //Save testdata of user include timestamp.
        }

        protected function started() {
            $this->handler = new TestHandler($this);
            $this->handler->loadCurrentTest();
        }

        public function _send($user, $message) {
            $this->send($user, $message);
        }
    }

    $s = new TestServer("0.0.0.0", "5890");

    try {
        $s->run();
    } catch (Exception $e) {
        $s->stdout($e->getMessage());
    }
?>