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
                //var_dump($json);
                if ($this->status > 1) {
                if ($json->type == "starttest") {
                    $this->handler->sendNextQuestion($user, $json->name);
                } else if ($json->type == "answer") {
                    $this->handler->processAnswer($user, $json->index);
                } else if ($json->type == "endtest") {
                    $this->handler->endTest($user, $json->time);
                } else if ($json->type == "specialpower") {
                    if ($json->remove) {
                        $this->handler->removePower($json->power, $json->user);
                    } else {
                        $this->handler->installPower($json->power, $json->user);
                    }
                }
                } else {
                    if ($json->type == "sessionstart") {
                        $this->status = 2; // Ready
                        $this->handler->addToManagerList($user);
                    }
                }
            }
        }

        protected function connected($user) {
            $this->stdout("Connection id: " . $user->id);
        }

        protected function closed($user) {
            //Save testdata of user include timestamp.
            $this->handler->finish($user);
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