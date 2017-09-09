var mode : Modes;
var wss : WebSocket;
var greenblob, redblob;
var viewingresult = false;
enum Modes {
    CLIENT,
    SERVER
}

window.onload = () => {
    preloadImages();
};

window.onkeyup = (event) => {
    if (event.keyCode === 13) {
        if (viewingresult) {
            selectMode(Modes[mode]);
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

function selectMode(m : string) {
    toFullScreen();
    document.body.style.backgroundColor = "#000000";
    mode = <Modes>Modes[m];
    document.body.innerHTML = "";
    document.body.id = "body";
    let imgholder = document.createElement("div");
    imgholder.className = "widm-logo-blur-holder";
    let img = document.createElement("img");
    img.src = "images/WIDM_LOGO_BLACK_BLURRED.jpg";
    img.className = "widm-logo-blur";
    imgholder.appendChild(img);
    document.body.appendChild(imgholder);
    let holder_ = document.createElement("div");
    holder_.id = "content";
    holder_.classList = "TB contentholder";
    let uberholder = document.createElement("div");
    uberholder.className = "TR";
    uberholder.id = "LOGON";
    let holder = document.createElement("div");
    holder.classList = "TD logon";
    let h = document.createElement("div");
    let input = document.createElement("input");
    input.id = "name";
    input.type = "text";
    input.placeholder = "Naam";
    input.className = "logon_input";
    h.appendChild(input);
    h.innerHTML += "<br>";
    let b = document.createElement("button");
    b.className = "logon_submit";
    b.onclick = getResult;
    b.innerHTML = "Resultaat";
    if (mode == Modes.SERVER) {h.appendChild(b);}
    holder.appendChild(h);
    uberholder.appendChild(holder);
    holder_.appendChild(uberholder);
    document.body.appendChild(holder_);
    document.getElementById("name").addEventListener("keyup", function() {sendInput();});
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
    wss.onopen = function(event) {
        
    };
    wss.onmessage = function(event) {
        if (mode == Modes.CLIENT) {
            processMessageClient(event.data);
        } else {
            processMessageServer(event.data);
        }
    };
    wss.onclose = function(event) {

    };
    wss.onerror = function(event) {
        alert("Error! Details logged to console.");
        console.error(event);
    };
}

function processMessageClient(msg : string = "{}") {
    let json = JSON.parse(msg);
    if (json.type === "letter") {
        document.getElementById("name").value = json.letter;
    } else if (json.type == "result") {
        let img = new Image();
        img.className = "resultimg";
        img.src = json.result === "green" ? greenblob : redblob;
        document.body.style.backgroundColor = "white";
        document.body.innerHTML = "";
        document.body.appendChild(img);
        img.addEventListener("click", () => {
            selectMode(Modes[mode]);
        });
    }
}

function processMessageServer(msg : string = "{}") {
    let json = JSON.parse(msg);
    if (json.type == "result") {
        let img = new Image();
        img.className = "resultimg";
        img.src = json.result === "green" ? greenblob : redblob;
        document.body.style.backgroundColor = "white";
        document.body.innerHTML = "";
        document.body.appendChild(img);
        img.addEventListener("click", () => {
            selectMode(Modes[mode]);
        });
    }
}

function getResult() {
    let n = document.getElementById("name").value;
    let o = {
        type: "resultreq",
        name: n
    };
    wss.send(JSON.stringify(o));
}

function sendInput() {
    if (mode == Modes.CLIENT) {return;}
    let data : string = document.getElementById("name").value;
    console.log(data);
    let o = {
        type: "letter",
        letter: data
    };
    if (!wss.CONNECTING)
    wss.send(JSON.stringify(o));
}