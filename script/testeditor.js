window.onload = function() {
    listFiles();
    let panel = createMainPanel("contestants");
    panel.setAttribute("type", "contestants");
    let holder = document.getElementById("holderright");
    holder.appendChild(panel);
    panel = createMainPanel("publishinfo");
    panel.setAttribute("type", "publishinfo");
    holder.appendChild(panel)
};
//Temp debug JS Output
function writeJsDebug(input) {
    jsDebugText = String(input);
    jsDebugOutput = document.getElementById("editorfooter");
    jsDebugOutput.innerHTML += jsDebugText + " | ";
}

function writeJsNewLine() {
    document.getElementById("editorfooter").innerHTML += " ~ | ";
}
//Counter for new question IDs, TEMP
var qidCount = 0;
//make a new question ID
function newqid() {
    newQid = "q" + qidCount;
    qidCount++;
    return newQid;
}
//make a new answer ID, based on the number of children
function newaid(parentId) {
    parentIdHolder = parentId + "_holder";
    aidCount = document.getElementById(parentIdHolder).childElementCount;
    aidCountNew = aidCount - 2;
    parentId += "_a" + aidCountNew;
    return parentId;
}
//make a new question. First, build the div element and assign an id and a class to it, then add it to the field. Then, update the title and toggle it.
function addquestion(title) {
    emptyquestion = document.createElement("div");
    emptyquestion.id = newqid();
    emptyquestion.className = "questionholder";
    qid = emptyquestion.id;
    emptyquestion.title = qid;
    if (typeof title === "undefined") {
        emptyquestion.innerHTML = '<div><button type="button" class="bttntoggleq-hide" title="Hide" id="bttntoggleq_' + qid + '" onclick="togglequestion(\'' + qid + '\');">&nbsp;</button><button type="button" class="delete_icon" title="Remove question" onclick="removequestion(this)">&nbsp;</button>&emsp;<span id="titleholder_' + qid + '" class="titleholder"></span></div><div id="' + qid + '_holder" class="question_holder"><button type="button" class="add_icon" title="Add answer" onclick="addanswer(\'' + qid + '\');">&nbsp;</button><input type="text" placeholder="Set title" onKeyUp="updateTitle(\'' + qid + '\');" id="input_title_' + qid + '"></div>';
    } else {
        emptyquestion.innerHTML = '<div><button type="button" class="bttntoggleq-hide" title="Hide" id="bttntoggleq_' + qid + '" onclick="togglequestion(\'' + qid + '\');">&nbsp;</button><button type="button" class="delete_icon" title="Remove question" onclick="removequestion(this)">&nbsp;</button>&emsp;<span id="titleholder_' + qid + '" class="titleholder">' + title + '</span></div><div id="' + qid + '_holder" class="question_holder"><button type="button" class="add_icon" title="Add answer" onclick="addanswer(\'' + qid + '\');">&nbsp;</button><input type="text" placeholder="Set title" onKeyUp="updateTitle(\'' + qid + '\');" id="input_title_' + qid + '" value = "' + title + '"></div>';
    }
    document.getElementById("questionholder").appendChild(emptyquestion);
    updateTitle(qid);
    togglequestion(qid);
    if (typeof title !== "undefined") {
        return qid;
    }
}
//function to remove the question
function removequestion(sender) {
    writeJsNewLine();
    var objHolder = sender.parentNode.parentNode;
    var questionHolder = sender.parentNode.parentNode.parentNode;
    var c = confirm("You are about to remove the question.\nAre you sure?");
    if (c == true) {
        var obj = document.getElementById(objHolder.id);
        obj.parentNode.removeChild(obj);
        var children = document.getElementById(questionHolder.id).childNodes;
        var i;
        for (i = 0; i < (children.length); i++) {
            newi = i--;
            writeJsDebug(i);
            writeJsDebug(newi);
            children[i].id = "q" + newi;
            children[i].title = children[i].id;
            writeJsDebug(children[i].id);
        }
    }
}
//make a new answer. First, build the div element. Then write it to the field.
function addanswer(parentId, answer, correct) {
    emptyanswer = document.createElement("div");
    aidCount = document.getElementById(parentId).childElementCount;
    emptyanswer.id = newaid(parentId);
    emptyanswer.className = "answerholder";
    aid = emptyanswer.id;
    emptyanswer.title = aid;
    if (typeof answer === undefined) {
        emptyanswer.innerHTML = '<button type="button" class="delete_icon" title="Remove answer" onclick="removeanswer(this);">&nbsp;</button><input type="checkbox" class="correctanswer" id="chb_' + aid + '" /><label class="chb_label" title="Answer is right" for="chb_' + aid + '"></label><input type="text" placeholder="Answer" id="input_answer_' + aid + '">';
        document.getElementById(parentId + "_holder").appendChild(emptyanswer);
    } else {
        emptyanswer.innerHTML = '<button type="button" class="delete_icon" title="Remove answer" onclick="removeanswer(this);">&nbsp;</button><input type="checkbox" class="correctanswer" id="chb_' + aid + '" /><label class="chb_label" title="Answer is right" for="chb_' + aid + '"></label><input type="text" placeholder="Answer" value="' + answer + '" id="input_answer_' + aid + '">';
        document.getElementById(parentId + "_holder").appendChild(emptyanswer);
        document.getElementById("chb_" + aid).checked = correct;
    }
}
//function to remove the answer
function removeanswer(sender) {
    var objHolder = sender.parentNode.parentNode;
    var objQNum = sender.parentNode.parentNode.parentNode;
    var obj = document.getElementById(sender.parentNode.id);
    obj.parentNode.removeChild(obj);
    var children = document.getElementById(objHolder.id).childNodes;
    var i;
    for (i = 2; i < (children.length); i++) {
        var newi = i - 2;
        children[i].id = objQNum.id + "_a" + newi;
        children[i].title = children[i].id;
    }
}
//toggle the question (show/hide). also updates the icon.
function togglequestion(qId) {
    questionToggleStatus = document.getElementById(qId + "_holder").style.display;
    if (questionToggleStatus !== "none") {
        document.getElementById(qId + "_holder").style.display = "none";
        document.getElementById("bttntoggleq_" + qId).className = "bttntoggleq-show";
        document.getElementById("bttntoggleq_" + qId).title = "Show";
    } else {
        document.getElementById(qId + "_holder").style.display = "block";
        document.getElementById("bttntoggleq_" + qId).className = "bttntoggleq-hide";
        document.getElementById("bttntoggleq_" + qId).title = "Hide";
    }
}
//Function to show all questions
function showall(el) {
    var children = document.getElementById("questionholder").childNodes;
    var i;
    for (i = 1; i < (children.length); i++) {
        var questionToggleStatus = document.getElementById(children[i].id + "_holder").style.display;
        if (questionToggleStatus === "none") {
            var qId = children[i].id;
            document.getElementById(qId + "_holder").style.display = "block";
            document.getElementById("bttntoggleq_" + qId).className = "bttntoggleq-hide";
            document.getElementById("bttntoggleq_" + qId).title = "Hide";
        }
    }
}
//Function to hide all questions
function hideall(el) {
    var children = document.getElementById("questionholder").childNodes;
    var i;
    for (i = 1; i < (children.length); i++) {
        var questionToggleStatus = document.getElementById(children[i].id + "_holder").style.display;
        if (questionToggleStatus !== "none") {
            var qId = children[i].id;
            document.getElementById(qId + "_holder").style.display = "none";
            document.getElementById("bttntoggleq_" + qId).className = "bttntoggleq-show";
            document.getElementById("bttntoggleq_" + qId).title = "Show";
        }
    }
}
//update the title of a question while typing and after generation of the question. If empty, show a message (No Title).
function updateTitle(qId) {
    var newTitle = document.getElementById("input_title_" + qId).value;
    if (newTitle === "") {
        newTitle = "<span class='error' title='Please add a title for this question'>No Title</span>";
    }
    document.getElementById("titleholder_" + qId).innerHTML = newTitle;
}

function expandPanel(el) {
    var p = el.parentNode.parentNode;
    if (p.hasAttribute("type")) {
        attr = p.getAttribute("type");
        if (p.getAttribute("type") === "contestants") {
            initContestantEditor();
        } else {
            loadPublishInfo();
        }
    }
    var actualholder = el.parentNode.parentNode;
    var children = actualholder.childNodes;
    for (var i = 0; i < children.length; i++) {
        if (children[i].className === "rightpanel_content") {
            children[i].style.display = "block";
        }
    }
    el.className = "showall_icon";
    el.onclick = function() { collapsePanel(this); };
}

function collapsePanel(el) {
    var actualholder = el.parentNode.parentNode;
    var children = actualholder.childNodes;
    for (var i = 0; i < children.length; i++) {
        if (children[i].className === "rightpanel_content") {
            children[i].style.display = "none";
        }
    }
    el.className = "hideall_icon";
    el.onclick = function() { expandPanel(this); };
}

function expandTest(el, nm) {
    var actualholder = el.parentNode;
    var kids = actualholder.childNodes;
    if (kids.length === 3) {
        getFileRevisions(nm, actualholder);
    }
    for (var i = 3; i < kids.length; i++) {
        if (kids[i].style) {
            kids[i].style.display = "block";
        }
    }
    el.className = "showall_icon";
    el.onclick = function() { collapseTest(this); };
}

function collapseTest(el) {
    var actualholder = el.parentNode;
    var kids = actualholder.childNodes;
    for (var i = 3; i < kids.length; i++) {
        if (kids[i].style) {
            kids[i].style.display = "none";
        }
    }
    el.className = "hideall_icon";
    el.onclick = function() { expandTest(this); };
}

function cleareditor() {
    document.getElementById("questionholder").innerHTML = "";
    qidCount = 0;
}

function backtoeditor() {
    saveContestants();
    cleareditor();
    let add = document.getElementById("add");
    add.title = "Add question";
    add.onclick = addquestion;
    let save = document.getElementById("save");
    save.title = "Save test";
    save.className = "save_icon";
    save.onclick = saveData;
    let qwolder = document.getElementById('questionholder');
    document.getElementById("questionholder").innerHTML = sessionStorage.getItem("lasteditedtest");
}

function initContestantEditor() {
    let html = document.getElementById('questionholder').innerHTML
    sessionStorage.lasteditedtest = html;
    cleareditor();
    let add = document.getElementById("add");
    add.title = "Add group";
    add.onclick = addgroup;
    let save = document.getElementById("save");
    save.title = "Back to testeditor";
    save.className = "back_icon";
    save.onclick = backtoeditor;
    listContestants();
}