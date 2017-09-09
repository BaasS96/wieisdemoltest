function saveData() {
    var questions = [];
    var children = document.getElementById("questionholder").childNodes;
    for (i = 0; i < (children.length - 1); i++) {
        var questionTitle = document.getElementById("input_title_q" + i).value;
        var object = {
            "id": i,
            "title": questionTitle
        };
        var answers = [];
        var questionChildren = document.getElementById("q" + i + "_holder").childNodes;
        for (j = 0; j < (questionChildren.length - 2); j++) {
            var answerTitle = document.getElementById("input_answer_q" + i + "_a" + j).value;
            var answerCorrect = document.getElementById("chb_q" + i + "_a" + j).checked;
            var o = {
                "title": answerTitle,
                "correct": answerCorrect
            };
            answers.push(o);
        }
        object.answers = answers;
        questions.push(object);
    }
    var testdatabase = JSON.stringify(questions);
    console.log(testdatabase);
    sendData(testdatabase);
}

function sendData(data) {
    var name = document.getElementById("test_name").value;
    name = name.replace(/\s+/g, '_').toLowerCase();
    var save = new Date();
    var timestring = "";
    timestring += save.getDate() + "_";
    timestring += save.getMonth() + "_";
    timestring += save.getFullYear() + "_";
    timestring += save.getHours() + "_" + save.getMinutes() + "_" + save.getSeconds();
    fetch("savefile.php?name=" + name + "&save=" + timestring + "&data=" + data)
        .then(function(res) {
            if (res.ok) {
                return res.text();
            } else {
                document.getElementById("lastsaved").innerHTML = "An error occured while saving: " + res.status + " - " + res.statusText;
            }
        })
        .then(function(succes) {
            document.getElementById("lastsaved").innerHTML = timestring;
        });
}

function saveContestants() {
    var groups = [];
    let qholder = document.getElementById('questionholder');
    if (currentid === 0) {
        let title = document.getElementById("titleholder_c0").innerHTML;
        var o = {};
        o[title] = [];
        let gholder = document.getElementById("c0");
        for (var l = 2; l < gholder.childNodes.length; l++) {
            let nm = gholder.childNodes[l].lastChild.value;
            o[title].push(nm);
        }
        groups.push(o);
    } else {
        try {
            for (i = 0; i <= currentid; i++) {
                var title = document.getElementById("titleholder_c" + i).innerHTML;
                var o = {};
                o[title] = [];
                var l = document.getElementById("c" + i).getAttribute("contestants");
                l = parseInt(l);
                if (l > 0) {
                    for (m = 0; m <= l; m++) {
                        console.log(i + "    " + m);
                        let nm = document.getElementById("c" + i + "e" + m).value;
                        o[title].push(nm);
                    }
                } else {
                    let nm = document.getElementById("c" + i + "e0").value;
                    o[title].push(nm);
                }
                groups.push(o);
            }
        } catch (error) {
            console.log(error);
        }
    }
    sendContestantData(JSON.stringify(groups));
}

function sendContestantData(data) {
    console.log(data);
    fetch("updatecontestants.php?data=" + data)
        .then(function(res) {
            if (res.ok) {
                return res.status;
            }
        }).then(function(res) {
            console.log(res);
        });
}