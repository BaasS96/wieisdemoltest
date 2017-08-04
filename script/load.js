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
            var holder = createFileOpenPanel();
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
                var parts = json[i].split("_");
                var date = parts[0] + "." + parts[1] + "." + parts[2] + "-" + parts[3] + ":" + parts[4] + ":" + parts[5];
                var holder = document.createElement("div");
                holder.className = "rightpanel_sub_subcontentholder";
                holder.innerHTML = i + 1 + " - " + date;
                parent.appendChild(holder);
            }
        });
}

function loadData(file) {
    var nameholder = document.getElementById("test_name");
    var questions = document.getElementById("questionholder");
    nameholder.value = file.name;
    for (var i = 0; i < file.answers.length; i++) {
        addquestion();
    }

}

function getData(file, preload) {
    fetch("getfile.php?file=" + file)
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
            //loadData(json);
            preload ? currenttest = json : loadData(json);
        });
}

function createFileOpenPanel() {
    var holder = document.createElement("div");
    holder.className = "rightpanel";
    var header = document.createElement("div");
    header.className = "rightpanel_header";
    header.innerHTML = "<button type='button' class='showall_icon' title='Show all questions' onclick='collapsePanel(this);'>&nbsp;</button> <span class='rightpanel_header_text'>Load file</span>";
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
    var c = "<button type='button' class='hideall_icon' title='Show all questions' onclick='expandTest(this, \"" + name + "\");'>&nbsp;</button> <span id='testname' class='rightpanel_subcontentholder_content'>" +
        name + "&emsp;<span class='rightpanel_content_italic'>" + revisions;
    if (revisions < 2) { c += " revision"; } else { c += " revisions"; }
    c += "</span></span>";
    h.innerHTML = c;
    return h;
}