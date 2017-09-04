<?php
    require_once("ws/websockets.php");

    class TestServer extends WebsocketServer {


        protected function process($user, $message) {

        }

        protected function connected($user) {

        }

        protected function closed($user) {

        }

        protected function started() {

        }
    }

    $s = new TestServer("0.0.0.0", "5890");

    try {
        $s->run();
    } catch (Exception $e) {
        $s->stdout($e->getMessage());
    }
?>