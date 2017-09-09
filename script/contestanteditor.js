var currentid = -1;
function addChildren(parent) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    for (var i = 0; i < args.length; i++) {
        parent.appendChild(args[i]);
    }
    return parent;
}
function addgroup(name) {
    var questionholder = document.createElement("div");
    var overallid = "c" + ++currentid;
    questionholder.title = overallid;
    questionholder.id = overallid;
    questionholder.className = "questionholder";
    questionholder.setAttribute("contestants", "-1");
    var holder = document.createElement("div");
    holder.setAttribute("open", "true");
    var buttontoggle = document.createElement("button");
    buttontoggle.className = "bttntoggleq-hide";
    buttontoggle.title = "Hide";
    buttontoggle.onclick = toggleGroup.bind(holder);
    var buttondelete = document.createElement("button");
    buttondelete.className = "delete_icon";
    buttondelete.title = "Delete";
    buttondelete.onclick = removeGroup.bind(questionholder);
    var titleholder = document.createElement("span");
    titleholder.className = "titleholder";
    titleholder.id = "titleholder_" + overallid;
    if (typeof name === "string") {
        titleholder.innerHTML = name;
    }
    var subtitleholder = document.createElement("span");
    subtitleholder.className = "error";
    subtitleholder.title = "Please add a title for this group";
    subtitleholder.innerHTML = "No Title";
    titleholder.appendChild(subtitleholder);
    var holder2 = document.createElement("div");
    holder2.id = overallid + "_holder";
    holder2.className = "question_holder";
    holder2.style.display = "block";
    var buttonadd = document.createElement("button");
    buttonadd.className = "add_icon";
    buttonadd.title = "Add answer";
    buttonadd.onclick = addContestant.bind(questionholder);
    var input = document.createElement("input");
    input.id = "input_title_" + overallid;
    input.placeholder = "Set title";
    input.onkeyup = function () { updateTitle(overallid); };
    input.type = "text";
    if (typeof name === "string") {
        input.value = name;
    }
    addChildren(holder, buttontoggle, buttondelete, titleholder);
    addChildren(holder2, buttonadd, input);
    addChildren(questionholder, holder, holder2);
    document.getElementById("questionholder").appendChild(questionholder);
    updateTitle(overallid);
    return questionholder;
}
function addContestant(name_) {
    ;
    var cholder = document.createElement("div");
    var cid = parseInt(this.getAttribute("contestants")) + 1;
    this.setAttribute("contestants", cid);
    cholder.className = "answerholder";
    cholder.title = "Contestant";
    var buttondel = document.createElement("button");
    buttondel.className = "delete_icon";
    buttondel.title = "Remove contestant";
    buttondel.onclick = removeContestant.bind(cholder);
    var name = document.createElement("input");
    name.placeholder = "Name";
    name.type = "text";
    if (typeof name_ === "string") {
        name.value = name_;
        name.id = "c" + currentid + "e" + cid;
    }
    else {
        name.id = "c" + this.id.substring(1) + "e" + cid;
    }
    addChildren(cholder, buttondel, name);
    this.appendChild(cholder);
}
function removeContestant() {
    var c = confirm("Are you sure that you want to remove this contestant?");
    if (c) {
        var val = this.parentNode.getAttribute("contestants");
        val = parseInt(val);
        val -= 1;
        this.parentNode.setAttribute("contestants", val);
        this.outerHTML = "";
        delete this;
    }
}
function toggleGroup() {
    if (this.getAttribute("open") === "true") {
        //for (var i = 0; i < this.childNodes.length; i++) {
        //    this.childNodes[i].style.display = "none";
        //}
        this.parentNode.childNodes[1].style.display = "none";
        this.setAttribute("open", false);
    }
    else {
        //for (var i = 0; i < this.childNodes.length; i++) {
        //    this.childNodes[i].style.display = "block";
        //}
        this.parentNode.childNodes[1].style.display = "block";
        this.setAttribute("open", true);
    }
}
function removeGroup() {
    var c = confirm("Are you sure that you want to delete this group?");
    if (c) {
        this.outerHTML = "";
        delete this;
        currentid--;
    }
}
