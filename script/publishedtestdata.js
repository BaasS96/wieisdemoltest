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
    fetch("data/contestants.json")
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
    newContestantHolder6.innerHTML = "<input type='checkbox' id='cIdJ' onchange=\"updateContestant(self);\"></input>";
    newContestant.appendChild(newContestantHolder6);
    let newContestantHolder7 = document.createElement("div");
    newContestantHolder7.className = "TD";
    newContestantHolder7.innerHTML = "<input type='checkbox' id='cIdV' onchange=\"updateContestant(self);\"></input>";;
    newContestant.appendChild(newContestantHolder7);
    document.getElementById("dataTable").appendChild(newContestant);
}

function updateProgress(uId, uProg, uRes, uTime) {
    if (uTime === "null") {
        uTime = "-";
    }
    let progDiv = uId + "progress";
    let resDiv = uId + "result";
    let timeDiv = uId + "time";
    document.getElementById(progDiv).innerHTML = uProg;
    document.getElementById(resDiv).innerHTML = uRes;
    document.getElementById(timeDiv).innerHTML = uTime;
}

function updateGroup(gId, gRes, gTime) {
    let resDiv = gId + "result";
    let timeDiv = gId + "time";
    document.getElementById(resDiv).innerHTML = gRes;
    document.getElementById(timeDiv).innerHTML = gTime;
}

//SECTION -- WEBSOCKET CONNECTIONS
// THIS Handles connection to the server that handles progress, answer checking reporting to supervisors etc...

function initConnection() {
    var url = "ws://" + document.URL.substr(7).split('/')[0] + ":5890";
    ws = new WebSocket(url);
    ws.onopen = function(event) {
        connectionOpenStatus = true;
        document.getElementById("sessionButton").innerHTML = "End session";
        ws.send(JSON.stringify({"type": "sessionstart"}));
    };
    ws.onmessage = function(event) {
        let responseData = JSON.parse(event.data);
        if (responseData.type === "progressupdate") {
            //When someone starts a test or finished a question, a progressupdate
            //will be sent to the server. This update contains a type (progressupdate),
            //and updates data for progress and result and of course the ID of the user.
            updateProgress(responseData.id, responseData.progress, responseData.result, responseData.time);
        } else if (responseData.type === "progressgroup") {
            updateGroup(responseData.id, responseData.result, responsedata.time)
        }
    };
    ws.onclose = function(event) {

    };
    ws.onerror = function(event) {
        //Display an error. @BaasS
    };
}