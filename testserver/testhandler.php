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
                $o = [
                    "type" => "contestantlogin",
                    "id" => $u->id
                ];
                $this->sendToManagers(json_encode($o));
            }
        }

        function processAnswer($user, $answer) {
            $us = $user->id;
            if ($this->test->checkAnswer($this->instances[$us]->atquestionindex, $answer)) {
                $this->instances[$us]->score++;
            }
            $this->sendNextQuestion($user);
            $this->statusUpdate($us);
            $this->calculateScore();
        }

        function endTest($user, $time) {
            $us = $user->id;
            $this->instances[$us]->ended = true;
            $this->instances[$us]->time = $time;
            $this->statusUpdate($us);
            $this->calculateScore();
        }

        function finish($user) {
            $us = $user->id;
            if (array_key_exists($us, $this->instances)) {
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
            return false;
        }

        function addToManagerList($u) {
            array_push($this->managers, $u);
        }

        function removeFromManagerList($u) {
            $index = array_search($u, $this->managers);
            array_splice($this->managers, $index, $index);
        }

        function installPower($power, $user) {
            $uid = 0;
            foreach($this->instances as $key => $value) {
                if ($value->id == $user) {
                    $uid = $key;
                    $this->instances[$key]->$power = true;
                    break;
                }
            }
            $this->calculateScore();
            $this->statusUpdate($uid);
        }

        function removePower($power, $user) {
            $uid = 0;
            foreach($this->instances as $key => $value) {
                if ($value->id == $user) {
                    $uid = $key;
                    $this->instances[$key]->$power = false;
                    if ($power == "joker") {
                        $this->instances[$key]->score--;
                    }
                    break;
                }
            }
            $this->calculateScore();
            $this->statusUpdate($uid);
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
                if ($value->joker) {
                    if ($value->score < $this->test->getNumberOfQuestions()) {
                        $value->score++;
                        $groups[$value->group] += $value->score;
                    } else {
                        $groups[$value->group] += $value->score;
                    }
                } else {
                    $groups[$value->group] += $value->score;
                }
                if ($value->exemption) {
                    continue;
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
            return $averaged;
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
            $file = dirname(__FILE__);
            $file = dirname($file);
            $file = $file . "\data\defaulttest.json";
            if (file_exists($file)) {
                $f = file_get_contents($file);
                $f = json_decode($f);
                $rev = $f->revision;
                $rev = str_replace(".", "_", $rev);
                $rev = str_replace("-", "_", $rev);
                $rev = str_replace(":", "_", $rev);
                $ff = str_replace("defaulttest.json", $f->name . "\\" . $f->name . "-" . $rev . ".json", $file);
                if (file_exists($ff)) {
                    $t = json_decode(file_get_contents($ff));
                    $this->test = new Test($f->name, $rev, $t);
                    $this->server->status = 1;
                }
            }
        }

        function save() {
            $results = $this->calculateScore();
            $lowestscore = -1;
            $lowesttime = 0;
            $loser = NULL;
            foreach ($results as $key => $value) {
                var_dump($value);
                if ($lowestscore == -1) {
                    $lowestscore = $value["score"];
                    $lowesttime = $value["time"];
                    $loser = $key;
                    continue;
                }
                if ($value["score"] < $lowestscore) {
                    $lowestscore = $value["score"];
                    $lowesttime = $value["time"];
                    $loser = $key;
                } else if ($value["score"] == $lowestscore) {
                    if ($value["time"] > $lowesttime) {
                        $lowestscore = $value["score"];
                        $lowesttime = $value["time"];
                        $loser = $key;
                    }
                }
            }
            $o = [
                "test" => $this->test->getTestName(),
                "revision" => $this->test->getTestRevision(),
                "loser" => $loser,
                "scores" => $results
            ];
            $resultsdir = $this->test->resolveResultsDirURL();
            if (!is_dir($resultsdir)) {
                mkdir($resultsdir);
            }
            $json = json_encode($o);
            $file = $resultsdir . "\\results.json";
            file_put_contents($file, $json);
            $this->sendToManagers(json_encode(["type" => "saved"]));
        }
    }
?>