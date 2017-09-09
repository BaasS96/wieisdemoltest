var ws;
var connectionOpenStatus = false;

function initPage() {
    getPublishedTest();
    getContestants();
}

function toggleSession() {
    if (connectionOpenStatus === false) {
        startSession();
    } else {
        endSession();
    }
}

function startSession() {
    document.getElementById("sessionButton").innerHTML = "Starting session...";
    initConnection();
}

function endSession() {
    document.getElementById("sessionButton").innerHTML = "Start session";
    ws.send(JSON.stringify({ "type": "sessionend" }));
}

function getPublishedTest() {
    fetch("data/defaulttest.json")
        .then(function(res) {
            if (res.ok) {
                return res.json();
            }
        })
        .then(function(json) {
            let testName = json.name;
            let testRevision = json.revision
            document.getElementById("pubtestname").innerHTML = testName + " / " + testRevision;
        })
}

function getContestants() {
    fetch("data/test_contestants.json")
        .then(function(res) {
            if (res.ok) {
                return res.json();
            }
        })
        .then(function(json) {
            for (var i = 0; i < json.length; i++) {
                let group = Object.keys(json[i])[0];
                newGroup(group);
                for (var j = 0; j < json[i][group].length; j++) {
                    let contestantname = Object.keys(json[i][group][j])[0];
                    let contestantid = json[i][group][j][contestantname].id;
                    let contestantpin = json[i][group][j][contestantname].code;
                    newContestant(contestantid, contestantname, contestantpin);
                }
            }
        });
}

function newGroup(groupName) {
    let newGroup = document.createElement("div");
    newGroup.className = "TR Group";
    let newGroupData = document.createElement("div");
    newGroupData.className = "TD";
    newGroupData.innerHTML = groupName;
    newGroup.appendChild(newGroupData);
    let newGroupData1 = document.createElement("div");
    newGroupData1.className = "TD";
    newGroupData1.innerHTML = "&nbsp;";
    newGroup.appendChild(newGroupData1);
    let newGroupData2 = document.createElement("div");
    newGroupData2.className = "TD";
    newGroupData2.innerHTML = "&nbsp;";
    newGroup.appendChild(newGroupData2);
    let newGroupData3 = document.createElement("div");
    newGroupData3.className = "TD";
    newGroupData3.innerHTML = "&nbsp;";
    newGroup.appendChild(newGroupData3);
    let newGroupData4 = document.createElement("div");
    newGroupData4.className = "TD";
    newGroupData4.setAttribute(name = "id", value = groupName + "result");
    newGroupData4.innerHTML = "-";
    newGroup.appendChild(newGroupData4);
    let newGroupData5 = document.createElement("div");
    newGroupData5.className = "TD";
    newGroupData5.setAttribute(name = "id", value = groupName + "time");
    newGroupData5.innerHTML = "-";
    newGroup.appendChild(newGroupData5);
    let newGroupData6 = document.createElement("div");
    newGroupData6.className = "TD";
    newGroupData6.innerHTML = "&nbsp;";
    newGroup.appendChild(newGroupData6);
    let newGroupData7 = document.createElement("div");
    newGroupData7.className = "TD";
    newGroupData7.innerHTML = "&nbsp;";
    newGroup.appendChild(newGroupData7);
    document.getElementById("dataTable").appendChild(newGroup);
}

function newContestant(cId, cName, cPin) {
    let newContestant = document.createElement("div");
    newContestant.className = "TR";
    let newContestantHolder = document.createElement("div");
    newContestantHolder.className = "TD";
    newContestantHolder.innerHTML = cId;
    newContestant.appendChild(newContestantHolder);
    let newContestantHolder1 = document.createElement("div");
    newContestantHolder1.className = "TD";
    newContestantHolder1.innerHTML = cName;
    newContestant.appendChild(newContestantHolder1);
    let newContestantHolder2 = document.createElement("div");
    newContestantHolder2.className = "TD";
    newContestantHolder2.innerHTML = cPin;
    newContestant.appendChild(newContestantHolder2);
    let newContestantHolder3 = document.createElement("div");
    newContestantHolder3.className = "TD";
    newContestantHolder3.setAttribute(name = "id", value = cId + "progress");
    newContestantHolder3.innerHTML = "0%";
    newContestant.appendChild(newContestantHolder3);
    let newContestantHolder4 = document.createElement("div");
    newContestantHolder4.className = "TD";
    newContestantHolder4.setAttribute(name = "id", value = cId + "result");
    newContestantHolder4.innerHTML = "-";
    newContestant.appendChild(newContestantHolder4);
    let newContestantHolder5 = document.createElement("div");
    newContestantHolder5.className = "TD";
    newContestantHolder5.setAttribute(name = "id", value = cId + "time");
    newContestantHolder5.innerHTML = "-";
    newContestant.appendChild(newContestantHolder5);
    let newContestantHolder6 = document.createElement("div");
    newContestantHolder6.className = "TD";
    newContestantHolder6.innerHTML = "<input type='checkbox' id='cIdJ' onchange=\"updateContestant(this, " + cId + ", 'joker');\"></input>";
    newContestant.appendChild(newContestantHolder6);
    let newContestantHolder7 = document.createElement("div");
    newContestantHolder7.className = "TD";
    newContestantHolder7.innerHTML = "<input type='checkbox' id='cIdV' onchange=\"updateContestant(this, " + cId + ", 'exemption');\"></input>";;
    newContestant.appendChild(newContestantHolder7);
    document.getElementById("dataTable").appendChild(newContestant);
}

function updateProgress(uId, uProg, uRes, uTime, uIndex) {
    if (uTime === "null") {
        uTime = "-";
    }
    let progDiv = uId + "progress";
    let resDiv = uId + "result";
    let timeDiv = millisecondsToTimeString(uTime) + "time";
    let prog = document.getElementById(progDiv);
    prog.innerHTML = uProg + "%";
    prog.title = "At question " + uIndex;
    document.getElementById(resDiv).innerHTML = uRes;
    document.getElementById(timeDiv).innerHTML = uTime;
}

function updateGroup(gScores) {
    if (gScores.constructor === Array) {
        for (var i = 0; i < gScores.length; i++) {
            let obj = gScores[i];
            let gId = Object.keys(obj)[0];
            let gRes = obj.gId.score;
            let gTime = obj.gId.time;
            let resDiv = gId + "result";
            let timeDiv = gId + "time";
            document.getElementById(resDiv).innerHTML = gRes;
            document.getElementById(timeDiv).innerHTML = gTime;
        }
    } else {
        let gId = Object.keys(gScores)[0];
        let gRes = gScores.gId.score;
        let gTime = gScores.gId.time;
        let resDiv = gId + "result";
        let timeDiv = gId + "time";
        document.getElementById(resDiv).innerHTML = gRes;
        document.getElementById(timeDiv).innerHTML = gTime;
    }
}

function updateContestant(element, id, power) {
    let o = {
        "type": "specialpower",
        "remove": !element.checked,
        "user": id,
        "power": power
    };
    ws.send(JSON.stringify(o));
}

function millisecondsToTimeString(duration) {
    var milliseconds = parseInt((duration % 1000) / 100),
        seconds = parseInt((duration / 1000) % 60),
        minutes = parseInt((duration / (1000 * 60)) % 60),
        hours = parseInt((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}

//SECTION -- WEBSOCKET CONNECTIONS
// THIS Handles connection to the server that handles progress, answer checking reporting to supervisors etc...

function initConnection() {
    var url = "ws://" + document.URL.substr(7).split('/')[0] + ":5890";
    ws = new WebSocket(url);
    ws.onopen = function(event) {
        connectionOpenStatus = true;
        document.getElementById("sessionButton").innerHTML = "End session";
        ws.send(JSON.stringify({ "type": "sessionstart" }));
    };
    ws.onmessage = function(event) {
        let responseData = JSON.parse(event.data);
        if (responseData.type === "progressupdate") {
            //When someone starts a test or finished a question, a progressupdate
            //will be sent to the server. This update contains a type (progressupdate),
            //and updates data for progress and result and of course the ID of the user.
            updateProgress(responseData.id, responseData.progress, responseData.result, responseData.time, responseData.index);
        } else if (responseData.type === "scoreupdate") {
            updateGroup(responseData.scores);
        } else if (responseData.type === "saved") {
            ws.close();
            alert("Results succesfully saved!");
        }
    };
    ws.onclose = function(event) {

    };
    ws.onerror = function(event) {
        //Display an error. @BaasS
    };
}