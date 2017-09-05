var mode : Modes;
var wss : WebSocket;
enum Modes {
    CLIENT,
    SERVER
}

function selectMode(m : string) {
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

function initiateConnection() {
    var url = "ws://" + document.URL.substr(7).split('/')[0] + ":5891";
    wss = new WebSocket(url);
    wss.onopen = function(event) {
        
    };
    wss.onmessage = function(event) {
        if (mode == Modes.CLIENT) {
            processMessageClient(event.data);
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
    }
}

function getResult() {
    
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