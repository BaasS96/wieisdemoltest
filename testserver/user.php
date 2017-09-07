<?php
    class User {

        public $name;
        public $group;
        public $id;
        public $atquestionindex = -1;
        protected $socket;
        public $score = 0;
        public $ended = false;
        public $time = 0;

        function __construct($socket, $nm) {
            $this->socket = $socket;
            $this->name = $nm;
            $this->resolveContestantInfo();
        }

        function incrementQuestionCount() {
            $this->atquestionindex++;
            return $this->atquestionindex;
        }

        function resolveContestantInfo() {
            $data = file_get_contents("../data/contestants.json");
            $data = json_decode($data);
            foreach ($data as $key => $value) {
                foreach($value as $key_ => $value_) {
                    foreach($value_ as $value__) {
                        $n = key($value__);
                        //$c = $value__->$n->code;
                        if ($n == $this->name) {
                            $this->group = $key_;
                            $this->id = $value__->$n->id;
                            break;
                        }
                    }
                }
            }
        }
    }
?>