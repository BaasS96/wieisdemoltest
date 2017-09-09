var ws;
var testStarted = false;
var nm;
var testStartedTime;
window.onload = function() {

}

function toFullScreen() {
    if (document.body.mozRequestFullScreen) {
        document.body.mozRequestFullScreen();
    } else if (document.body.webkitRequestFullScreen) {
        document.body.webkitRequestFullscreen();
    } else {
        document.body.requestFullscreen();
    }
    document.getElementById("bttnFullscreen").style.display = "none";
}

function checkFullscreen() {
    if (!window.fullScreen) {
        document.getElementById("bttnFullscreen").style.display = "block";
    } else {
        document.getElementById("bttnFullscreen").style.display = "none";
    }
}

window.onkeypress = function(event) {
    if (!testStarted) {
        if (event.keyCode === 13) {
            initializeTest();
        }
    }
}

function initTest() {
    //Disable right-clicking
    document.addEventListener('contextmenu', event => event.preventDefault());
    setTimeout(function() {
        //document.body.mozRequestFullScreen();
    }, 1000);
}

function initializeTest() {
    let name = document.getElementById("name").value;
    let pin = document.getElementById("pin").value;
    fetch("checkAuth.php?name=" + name + "&pin=" + pin)
        .then(function(res) {
            if (res.ok) {
                return res.text();
            }
        })
        .then(function(txt) {
            if (txt === "OK") {
                //Authorized
                nm = name;
                testStartedTime = new Date().getTime();
                initConnection();
                startTest();
            } else {
                document.getElementById("errMSSG").style.display = "block";
                document.getElementById("pin").value = "";
            }
        });
}

function startTest() {
    testStarted = true;
    let logonDiv = document.getElementById("LOGON");
    let questionaDiv = document.getElementById("QUESTIONA");
    let questionbDiv = document.getElementById("QUESTIONB");
    logonDiv.style.opacity = "0.0";
    setTimeout(function() {
        document.getElementById("pin").value = "";
        document.getElementById("name").value = "";
        logonDiv.style.display = "none";
        questionaDiv.style.display = "block";
        questionbDiv.style.display = "block";
        questionaDiv.style.opacity = "0.0";
        questionbDiv.style.opacity = "0.0";
    }, 1000);
    setTimeout(function() {
        questionaDiv.style.opacity = "1.0";
        questionbDiv.style.opacity = "1.0";
    }, 1100);
}

function loadQuestion(question, answers, lastquestion) {
    var questionTitle = question.title;
    var questionIndex = question.index;
    var questionQuestion = (question.index + 1) + ". &nbsp; " + question.title;
    var questionAnswers = "";
    if (lastquestion) {
        questionAnswers += "<div class='input-bttn-holder'><button type='submit' class='input-bttn' onclick=\"endTest();\">&nbsp;</button><span class='input-bttn-txt'>" + answers[0] + "<span></div>";
    } else {
        for (var i = 0; i < answers.length; i++) {
            questionAnswers += "<div class='input-bttn-holder'><button type='submit' class='input-bttn' onclick=\"buttonClicked(" + i + ");\">&nbsp;</button><span class='input-bttn-txt'>" + answers[i] + "<span></div>";
        }
    }
    if (answers.length > 4) {
        document.getElementById("QAnswers").style.columns = "2";
    }
    document.getElementById("QQuestion").innerHTML = questionQuestion;
    document.getElementById("QAnswers").innerHTML = questionAnswers;
    setTimeout(function() {
        document.getElementById("QUESTIONA").style.opacity = "1.0"
        document.getElementById("QUESTIONB").style.opacity = "1.0"
    }, 200);
}

function loadLastQuestion(question, answers) {
    document.getElementById("QQuestion").innerHTML = question.title;
    let questionanswer = "<div class='input-bttn-holder'><button type='submit' class='input-bttn' onclick=\"endTest();\">&nbsp;</button><span class='input-bttn-txt'>" + answers[0] + "<span></div>";
    document.getElementById("QAnswers").innerHTML = questionanswer;
}

function buttonClicked(questionIndex) {
    document.getElementById("QUESTIONA").style.opacity = "0.0"
    document.getElementById("QUESTIONB").style.opacity = "0.0"
    setTimeout(function() {
        let objectToSend = { type: "answer", index: questionIndex };
        ws.send(JSON.stringify(objectToSend));
    }, 1000);
}

//SECTION -- WEBSOCKET CONNECTIONS
// THIS Handles connection to the server that handles progress, answer checking reporting to supervisors etc...

function initConnection() {
    var url = "ws://" + document.URL.substr(7).split('/')[0] + ":5890";
    ws = new WebSocket(url);
    ws.onopen = function(event) {
        requestStart();
    };
    ws.onmessage = function(event) {
        let responseData = JSON.parse(event.data);
        if (responseData.type === "question") {
            loadQuestion(responseData.data, responseData.answers, responseData.lastquestion);
        } else {
            //Dosomethingandmakemehappy:)
        }
    };
    ws.onclose = function(event) {

    };
    ws.onerror = function(event) {
        //Display an error. @BaasS
    };
}

function requestStart() {
    let o = {
        type: "starttest",
        name: nm
    };
    ws.send(JSON.stringify(o));
}

function endTest() {
    //Send the closing frame
    let now = new Date().getTime();
    let testSeconds = now - testStartedTime;
    let o = {
        type: "testend",
        time: testSeconds
    };
    ws.send(JSON.stringify(o));
    //Close the connection
    ws.close();
    //Reset the instance
    testStarted = false;
    testStartedTime = undefined;
    nm = undefined;
    ws = undefined;
    //Go back to login screen
    let logonDiv = document.getElementById("LOGON");
    let questionaDiv = document.getElementById("QUESTIONA");
    let questionbDiv = document.getElementById("QUESTIONB");
    questionaDiv.style.opacity = "0.0";
    questionbDiv.style.opacity = "0.0";
    setTimeout(function() {
        logonDiv.style.display = "block";
        questionaDiv.style.display = "none";
        questionbDiv.style.display = "none";
    }, 1000);
    setTimeout(function() {
        logonDiv.style.opacity = "1.0";
    }, 1100);
}
//--------------------
//OLD TEST SYSTEM
//KEEPING THIS FOR NOW
// -------------------

/*
var testname, currenttest;
window.onload = function() {
    fetch("data/defaulttest.json")
    .then(function(res) {
        var ctype = res.headers.get("content-type");
        if (ctype && ctype.includes("application/json")) {
            if (res.ok) {
                return res.json();
            } else {
                //Handle error code
            }
        }
        throw new TypeError("Did not receive content-type application/json");
    })
    .then(function(json){
        testname = json.name;
        loadData(json.file, true);
    });
};

function startTest() {
    var name = document.getElementById("name");
    var pin = document.getElementById("pin");
    if (pin.value && name.value) {
        if (currenttest && currentetst !== "") {
            var init = initializeTest(name, pin);
            if (init === true) {
                //Continue with the actual test;
                document.getElementById('logon').style.display = "none";
                document.activeElement('content').style.display = "table-cell";
            } else {
                alert(init);
            }
        }
    } else {
        alert("voor waardes in");
    }
}

function initializeTest(name, pin) {
    fetch("checkAuth.php?name=" + name + "&pin=" + pin)
    .then(function(res) {
        if (res.ok) {
            return res.text();
        }
    })
    .then(function(txt) {
        if (txt === "") {
            //authorized
            return true;
        } else {
            return txt;
        }
    });
}
*/