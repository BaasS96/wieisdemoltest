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
            echo $n;
            echo $r;
            var_dump($q);
            echo count($q);
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
                    "question" => "De test is nu afgelopen.",
                    "answers" => ["OK"]
                ];
                return json_encode($o);
            }
        }

        function checkAnswer($index, $answer) {
            $arrayofanswers = $this->questions[$index];
            foreach ($arrayofanswers as $element) {
                if ($element->title == $answer) {
                    return $element->correct;                
                }
            }
            return false;
        }
    }
?>