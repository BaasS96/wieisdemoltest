var mode;
var wss;
var greenblob, redblob;
var viewingresult = false;
var Modes;
(function(Modes) {
    Modes[Modes["CLIENT"] = 0] = "CLIENT";
    Modes[Modes["SERVER"] = 1] = "SERVER";
})(Modes || (Modes = {}));
window.onload = function() {
    preloadImages();
};
window.onkeyup = function(event) {
    if (event.keyCode === 13) {
        if (viewingresult) {
            selectMode(Modes[mode], false);
        } else {
            getResult();
        }
    }
};

function toFullScreen() {
    if (document.body.mozRequestFullScreen) {
        document.body.mozRequestFullScreen();
    } else if (document.body.webkitRequestFullScreen) {
        document.body.webkitRequestFullscreen();
    } else {
        document.body.requestFullscreen();
    }
}

function selectMode(m, init) {
    if (init === void 0) { init = true; }
    toFullScreen();
    document.body.style.backgroundColor = "#000000";
    mode = Modes[m];
    document.body.innerHTML = "";
    document.body.id = "body";
    var imgholder = document.createElement("div");
    imgholder.className = "widm-logo-blur-holder";
    var img = document.createElement("img");
    img.src = "images/WIDM_LOGO_BLACK_BLURRED.jpg";
    img.className = "widm-logo-blur";
    imgholder.appendChild(img);
    document.body.appendChild(imgholder);
    var holder_ = document.createElement("div");
    holder_.id = "content";
    holder_.classList = "TB contentholder";
    var uberholder = document.createElement("div");
    uberholder.className = "TR";
    uberholder.id = "LOGON";
    var holder = document.createElement("div");
    holder.classList = "TD logon";
    var h = document.createElement("div");
    var input = document.createElement("input");
    input.id = "name";
    input.type = "text";
    input.placeholder = "Naam";
    input.className = "logon_input";
    h.appendChild(input);
    h.innerHTML += "<br>";
    var b = document.createElement("button");
    b.className = "logon_submit";
    b.onclick = getResult;
    b.innerHTML = "Resultaat";
    if (mode == Modes.SERVER) {
        h.appendChild(b);
    }
    holder.appendChild(h);
    uberholder.appendChild(holder);
    holder_.appendChild(uberholder);
    document.body.appendChild(holder_);
    document.getElementById("name").addEventListener("keyup", function() { sendInput(); });
    if (init)
        initiateConnection();
}

function preloadImages() {
    fetch("images/groenscherm.png")
        .then(function(res) {
            if (res.ok) {
                return res.blob();
            }
        })
        .then(function(blob) {
            greenblob = URL.createObjectURL(blob);
        });
    fetch("images/roodscherm.png")
        .then(function(res) {
            if (res.ok) {
                return res.blob();
            }
        })
        .then(function(blob) {
            redblob = URL.createObjectURL(blob);
        });
}

function initiateConnection() {
    var url = "ws://" + document.URL.substr(7).split('/')[0] + ":5891";
    wss = new WebSocket(url);
    wss.onopen = function(event) {};
    wss.onmessage = function(event) {
        if (mode == Modes.CLIENT) {
            processMessageClient(event.data);
        } else {
            processMessageServer(event.data);
        }
    };
    wss.onclose = function(event) {};
    wss.onerror = function(event) {
        alert("Error! Details logged to console.");
        console.error(event);
    };
}

function processMessageClient(msg) {
    if (msg === void 0) { msg = "{}"; }
    var json = JSON.parse(msg);
    if (json.type === "letter") {
        document.getElementById("name").value = json.letter;
    } else if (json.type == "result") {
        var img = new Image();
        img.className = "resultimg";
        img.src = json.color === "green" ? greenblob : redblob;
        document.body.style.backgroundColor = "white";
        document.body.innerHTML = "";
        document.body.appendChild(img);
        img.addEventListener("click", function() {
            selectMode(Modes[mode]);
        });
    } else if (json.type == "done") {
        selectMode(Modes[mode], false);
    }
}

function processMessageServer(msg) {
    if (msg === void 0) { msg = "{}"; }
    var json = JSON.parse(msg);
    if (json.type == "result") {
        var img = new Image();
        img.className = "resultimg";
        img.src = json.color === "green" ? greenblob : redblob;
        document.body.style.backgroundColor = "white";
        document.body.innerHTML = "";
        document.body.appendChild(img);
        img.addEventListener("click", function() {
            selectMode(Modes[mode], false);
            let o = {
                "type": "done"
            };
            setTimeout(function() { wss.send(JSON.stringify(o)) }, 100);
        });
    }
}

function getResult() {
    var n = document.getElementById("name").value;
    var o = {
        type: "resultreq",
        name: n
    };
    wss.send(JSON.stringify(o));
}

function sendInput() {
    if (mode == Modes.CLIENT) {
        return;
    }
    var data = document.getElementById("name").value;
    console.log(data);
    var o = {
        type: "letter",
        letter: data
    };
    if (!wss.CONNECTING)
        wss.send(JSON.stringify(o));
}