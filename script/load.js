function listFiles() {
    fetch("listtests.php")
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
        .then(function(json) {
            var holder = createMainPanel("file");
            var keys = Object.keys(json);
            var l = keys.length;
            for (var i = 0; i < l; i++) {
                var testname = keys[i];
                var revisions = json[testname];
                holder.getElementsByClassName("rightpanel_content")[0].appendChild(createFileOpenSubPanel(testname, revisions, i));
            }
            document.getElementById("holderright").appendChild(holder);
        });
}

function getFileRevisions(test, parent) {
    fetch("listrevisions.php?test=" + test)
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
        .then(function(json) {
            var l = json.length;
            for (var i = 0; i < l; i++) {
                let parts = json[i].split("_");
                let date = parts[0] + "." + parts[1] + "." + parts[2] + "-" + parts[3] + ":" + parts[4] + ":" + parts[5];
                let holder = document.createElement("div");
                holder.className = "rightpanel_sub_subcontentholder";
                holder.innerHTML = i + 1 + " - " + date;
                holder.setAttribute("test", test);
                holder.setAttribute("revision", date);
                holder.onclick = getData.bind(holder);
                parent.appendChild(holder);
            }
        });
}

function loadData(file, tname) {
    cleareditor();
    var nameholder = document.getElementById("test_name");
    var lastsaved = document.getElementById("lastsaved");
    var questions = document.getElementById("questionholder");
    nameholder.value = tname;
    lastsaved.innerHTML = file.rev;
    var data = JSON.parse(file.data);
    data.forEach(function(currentelement) {
        var pid = addquestion(currentelement.title);
        for (var i = 0; i < currentelement.answers.length; i++) {
            addanswer(pid, currentelement.answers[i].title, currentelement.answers[i].correct);
        }
    }, this);
}

function getData(event) {
    var file = this.getAttribute('test');
    var revision = this.getAttribute('revision');
    fetch("getfile.php?file=" + file + "&revision=" + revision)
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
        .then(function(json) {
            //Process json further
            loadData(json, file);
        });
}

function listContestants() {
    fetch("data/contestants.json")
        .then(function(res) {
            var ctype = res.headers.get("content-type");
            if (ctype && ctype.includes("application/json")) {
                if (res.ok) {
                    return res.text();
                } else {
                    //Handle error code
                }
            }
            throw new TypeError("Did not receive content-type application/json");
        })
        .then(function(rjson) {
            initContestantEditor();
            if (rjson === "") {
                return;
            }
            var json;
            try {
                json = JSON.parse(rjson);
            } catch (error) {
                console.log(error);
            }
            var holder = createMainPanel("contestants");
            var keys = Object.keys(json);
            var l = keys.length;
            for (var i = 0; i < l; i++) {
                var testname = keys[i];
                var revisions = json[testname];
                holder.getElementsByClassName("rightpanel_content")[0].appendChild(createFileOpenSubPanel(testname, revisions, i));
            }
            document.getElementById("holderright").appendChild(holder);
        });
}

function createMainPanel(type) {
    if (type === void 0) { type = "file"; }
    var holder = document.createElement("div");
    holder.className = "rightpanel";
    var header = document.createElement("div");
    header.className = "rightpanel_header";
    var html;
    if (type === "file") {
        html = "<button type='button' class='showall_icon' title='Show contents' onclick='collapsePanel(this);'>&nbsp;</button> <span class='rightpanel_header_text'>Load file";
    } else if (type === "publishinfo") {
        html = "<button type='button' class='showall_icon' title='Show contents' onclick='expandPanel(this);'>&nbsp;</button> <span class='rightpanel_header_text'>Publication info";
    } else {
        html = "<button type='button' class='showall_icon' title='Show contents' onclick='expandPanel(this);'>&nbsp;</button> <span class='rightpanel_header_text'>Contestants";
    }
    html += "</span>";
    header.innerHTML = html;
    var panel = document.createElement("div");
    panel.className = "rightpanel_content";
    holder.appendChild(header);
    holder.appendChild(panel);
    return holder;
}

function createFileOpenSubPanel(name, revisions, index) {
    var hh = document.createElement("div");
    var h = document.createElement("div");
    h.className = "rightpanel_subcontentholder";
    var c = "<button type='button' class='hideall_icon' title='Show all revisions' onclick='expandTest(this, \"" + name + "\");'>&nbsp;</button> <span id='testname' onclick='getData(\"" + name + "\", \"LATEST\", false)' class='rightpanel_subcontentholder_content'>" +
        name + "&emsp;<span class='rightpanel_content_italic'>" + revisions;
    if (revisions < 2) {
        c += " revision";
    } else {
        c += " revisions";
    }
    c += "</span></span>";
    h.innerHTML = c;
    return h;
}

function stringToDom(str) {
    var parser = new DOMParser()
    return parser.parseFromString(str, "text/html");
}