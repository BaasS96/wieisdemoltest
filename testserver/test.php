<?php
    class Test {
        protected $name;
        protected $revision;
        protected $questions;
        protected $numberofquestions;

        function __construct($n, $r, $q) {
            $this->name = $n;
            $this->revision = $r;
            $this->questions = $q;
            $this->numberofquestions = count($q);
            var_dump($q);
        }

        function getQuestionAtIndex($index) {
            if ($index < $this->numberofquestions) {
                $rawjson = $this->questions[$index];
                $o = [
                    "type" => "question",
                    "lastquestion" => false,
                    "data" => ["title" => $rawjson->title, "index" => $index]
                ];
                $a = [];
                foreach ($rawjson->answers as $value) {
                    array_push($a, $value->title);
                }
                $o["answers"] = $a;
                return json_encode($o);
            } else {
                $o = [
                    "type" => "question",
                    "lastquestion" => true,
                    "data" => ["title" => "De test is nu afgelopen.", "index" => $index],
                    "answers" => ["OK"]
                ];
                return json_encode($o);
            }
        }

        function checkAnswer($index, $answer) {
            $arrayofanswers = $this->questions[$index];
            foreach ($arrayofanswers->answers as $element) {
                if ($element->title == $answer) {
                    return $element->correct;                
                }
            }
            return false;
        }

        function resolveResultsDirURL() {
            $file = dirname(__FILE__);
            $file = dirname($file);
            $file = $file . "\data\\" . $this->name . "\\" . $this->name . "_results";
            return $file;
        }

        function getNumberOfQuestions() {
            return $this->numberofquestions - 1;
        }

        function calculateProgressPercentile($index) {
            $d100 = $this->numberofquestions / 100;
            $percentile = ceil($index / $d100);
            return $percentile;
        }
    }
?>