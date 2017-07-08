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
qidCount = 0;

//make a new question ID
function newqid() {
    newQid = "q" + qidCount;
    qidCount ++;
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
function addquestion() {
    emptyquestion = document.createElement("div");
    emptyquestion.id = newqid();
    emptyquestion.className = "questionholder";
    qid = emptyquestion.id;
    emptyquestion.title = qid;
    emptyquestion.innerHTML = '<div><button type="button" class="bttntoggleq-hide" title="Hide" id="bttntoggleq_'+ qid +'" onclick="togglequestion(\''+ qid +'\');">&nbsp;</button><button type="button" class="delete_icon" title="Remove question" onclick="removequestion(this)">&nbsp;</button>&emsp;<span id="titleholder_'+ qid +'" class="titleholder"></span></div><div id="'+ qid +'_holder" class="question_holder"><button type="button" class="add_icon" title="Add answer" onclick="addanswer(\''+ qid +'\');">&nbsp;</button><input type="text" placeholder="Set title" onKeyUp="updateTitle(\''+ qid +'\');" id="input_title_'+ qid +'"></div>';
    document.getElementById("questionholder").appendChild(emptyquestion);
    updateTitle(qid);
    togglequestion(qid);
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
        for (i=0; i<(children.length); i++) {
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
function addanswer(parentId) {
    emptyanswer = document.createElement("div");
    aidCount = document.getElementById(parentId).childElementCount;
    emptyanswer.id = newaid(parentId);
    emptyanswer.className = "answerholder";
    aid = emptyanswer.id;
    emptyanswer.title = aid;
    emptyanswer.innerHTML = '<button type="button" class="delete_icon" title="Remove answer" onclick="removeanswer(this);">&nbsp;</button><input type="checkbox" class="correctanswer" id="chb_'+ aid +'" /><label class="chb_label" title="Answer is right" for="chb_'+ aid +'"></label><input type="text" placeholder="Answer">';
    document.getElementById(parentId + "_holder").appendChild(emptyanswer);
}
//function to remove the answer
function removeanswer(sender) {
    var objHolder = sender.parentNode.parentNode;
    var objQNum = sender.parentNode.parentNode.parentNode;
    var obj = document.getElementById(sender.parentNode.id);
    obj.parentNode.removeChild(obj);
    var children = document.getElementById(objHolder.id).childNodes;
    var i;
    for (i=2; i<(children.length); i++) {
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
    }
    else {
        document.getElementById(qId + "_holder").style.display = "block";
        document.getElementById("bttntoggleq_" + qId).className = "bttntoggleq-hide";
        document.getElementById("bttntoggleq_" + qId).title = "Hide";
    }    
}
//Function to show all questions
function showall() {
    children = document.getElementById("questionholder").childNodes;
    var i;
     for (i=1; i<(children.length); i++) {
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
function hideall() {
    children = document.getElementById("questionholder").childNodes;
    var i;
     for (i=1; i<(children.length); i++) {
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