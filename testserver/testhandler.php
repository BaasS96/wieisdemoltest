<?php
    require_once("user.php");
    require_once("test.php");
    class TestHandler {

        protected $server;
        protected $test;
        protected $instances = [];

        function __construct($server) {
            $this->server = $server;
        }

        function sendNextQuestion($user, $name = NULL) {
            $us = $user->id;
            if (isset($this->instances[$us])) {
                $index = $this->instances[$us]->incrementQuestionCount();
                $this->server->_send($user, $this->test->getQuestionAtIndex($index));
            } else {
                $u = new User($user, $name);
                $u->incrementQuestionCount();
                $instances[$us] = $u;
                $this->server->_send($user, $this->test->getQuestionAtIndex(0));
            }
        }

        function processAnswer($user, $answer) {
            $us = $user->id;
            if ($this->test->checkAnswer($this->instances[$us]->atquestionindex, $answer)) {
                $this->instances[$us]->score++;
            }
            $this->sendNextQuestion($user);
        }

        function loadCurrentTest() {
            if (file_exists("../data/defaulttest.json")) {
                $f = file_get_contents("../data/defaulttest.json");
                $f = json_decode($f);
                $rev = $f->revision;
                $rev = str_replace(".", "_", $rev);
                $rev = str_replace("-", "_", $rev);
                $rev = str_replace(":", "_", $rev);
                $ff = "../data/" . $f->name . "/" . $f->name . "-" . $rev . ".json";
                if (file_exists($ff)) {
                    $t = json_decode(file_get_contents($ff));
                    $this->test = new Test($f->name, $rev, $t);
                    $this->server->status = 1;
                }
            }
        }
    }
?>