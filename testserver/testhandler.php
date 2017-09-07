<?php
    require_once("user.php");
    require_once("test.php");
    class TestHandler {

        protected $server;
        protected $test;
        protected $instances = [];
        protected $managers = [];

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
                $this->instances[$us] = $u;
                $this->server->_send($user, $this->test->getQuestionAtIndex(0));
            }
        }

        function processAnswer($user, $answer) {
            $us = $user->id;
            if ($this->test->checkAnswer($this->instances[$us]->atquestionindex, $answer)) {
                $this->instances[$us]->score++;
            }
            $this->sendNextQuestion($user);
            $this->statusUpdate($user);
            $this->calculateScore();
        }

        function endTest($user, $time) {
            $us = $user->id;
            $this->instances[$us]->ended = true;
            $this->instances[$us]->time = $time;
            $this->statusUpdate($user);
            $this->calculateTimeScore();
        }

        function finish($user) {
            $us = $user->id;
            $resultsdir = $this->test->resolveResultsDirURL();
            if (!is_dir($resultsdir)) {
                mkdir($resultsdir);
            }
            $data = serialize($this->instances[$us]);
            $file = $resultsdir . "/" . $this->instances[$us]->name . ".result";
            file_put_contents($file, $data);
            //unset($this->instances[$us]);
            return $data;
        }

        function addToManagerList($u) {
            array_push($this->managers, $u);
        }

        function installPower($power, $user) {
            foreach($this->instances as $key => $value) {
                if ($value->id == $user) {
                    array_push($this->instances[$key]->powers, $power);
                }
            }
            $this->calculateScore();
        }

        function removePower($power, $user) {
            foreach($this->instances as $key => $value) {
                if ($value->id == $user) {
                    array_splice($this->instances[$key]->powers, $power);
                }
            }
            $this->calculateScore();
        }

        function calculateScore() {
            $groups = [];
            $grouptimes = [];
            $groupcounts = [];
            $averaged = [];
            foreach($this->instances as $key => $value) {
                if (!array_key_exists($value->group, $groups)) {
                    $groups[$value->group] = 0;
                    $grouptimes[$value->group] = 0;
                    $groupcounts[$value->group] = 0;
                }
                $groupcounts[$value->group]++;
                if (empty($value->powers)) {
                    $groups[$value->group] += $value->score;
                } else {
                    foreach($value->power as $power) {
                        if ($power == "exemption") {
                            continue 2;
                        } else if ($power == "joker") {
                            if ($value->score < $this->test->getNumberOfQuestions()) {
                                $value->score++;
                                $groups[$value->group] += $value->score;
                            }
                        }
                    }
                }
                if (isset($value->time)) {
                    $grouptimes[$value->group] += $value->time;
                }
            }
            foreach($groups as $key => $value) {
                $score = $value;
                $numberofcontestants = $groupcounts[$key];
                $average = $score / $numberofcontestants;
                $average = ceil($average);
                $averaged[$key] = ["score" => $average];
            }
            foreach($grouptimes as $key => $value) {
                $score = $value;
                $numberofcontestants = $groupcounts[$key];
                $average = ceil($score / $numberofcontestants);
                $averaged[$key]["time"] = $average;
            }
            $o = [
                "type" => "scoreupdate",
                "scores" => $averaged
            ];
            $o = json_encode($o);
            $this->sendToManagers($o);
        }

        function statusUpdate($user) {
            $u = $this->instances[$user];
            $o = [
                "type" => "progressupdate",
                "id" => $u->id,
                "progress" => $this->test->calculateProgressPercentile($u->atquestionindex),
                "index" => $u->atquestionindex,
                "result" => $u->score,
                "time" => $u->time
            ];
            $this->sendToManagers(json_encode($o));
        }

        function sendToManagers($message) {
            foreach($this->managers as $value) {
                $this->server->_send($value, $message);
            }
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