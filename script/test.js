var ws;
function initTest() {
    //Disable right-clicking
    document.addEventListener('contextmenu', event => event.preventDefault());
}

function initializeTest(name, pin) {
    fetch("checkAuth.php?name=" + name + "&pin=" + pin)
    .then(function(res) {
        if (res.ok) {
            return res.text();
        }
    })
    .then(function(txt) {
        if (txt === "OK") {
            //Authorized
        } else {
            //Display error
        }
    });
}

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

//SECTION -- WEBSOCKET CONNECTIONS
// THIS Handles connection to the server that handles progress, answer checking reporting to supervisors etc...

function initConnection() {
    var url = "ws://" + document.URL.substr(7).split('/')[0] + ":5890";
    ws = new WebSocket(url);
    ws.onopen = function(event) {

    };
    ws.onmessage = function(event) {

    };
    ws.onclose = function(event) {

    };
    ws.onerror = function(event) {

    };
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