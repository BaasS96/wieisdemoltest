var currentid = -1;

function addChildren(parent, ...args) {
    for (var i = 0; i < args.length; i++) {
        parent.appendChild(args[i]);
    }
    return parent;
}

function addgroup(name? : string) {
    let questionholder = document.createElement("div");
    var overallid = "c" + ++currentid;
    questionholder.title = overallid;
    questionholder.id = overallid;
    questionholder.className = "questionholder";
    questionholder.setAttribute("contestants", "-1");
    let holder = document.createElement("div");
    holder.setAttribute("open", "true");
    let buttontoggle = document.createElement("button");
    buttontoggle.className = "bttntoggleq-hide";
    buttontoggle.title = "Hide";
    buttontoggle.onclick = toggleGroup.bind(holder);
    let buttondelete = document.createElement("button");
    buttondelete.className = "delete_icon";
    buttondelete.title = "Delete";
    buttondelete.onclick = removeGroup.bind(questionholder);
    let titleholder = document.createElement("span");
    titleholder.className = "titleholder";
    titleholder.id = "titleholder_" + overallid;
    if (typeof name === "string") {
        titleholder.innerHTML = name;
    }
    let subtitleholder = document.createElement("span");
    subtitleholder.className = "error";
    subtitleholder.title = "Please add a title for this group";
    subtitleholder.innerHTML = "No Title";
    titleholder.appendChild(subtitleholder);
    let holder2 = document.createElement("div");
    holder2.id = overallid + "_holder";
    holder2.className = "question_holder";
    holder2.style.display = "block";
    let buttonadd = document.createElement("button");
    buttonadd.className = "add_icon";
    buttonadd.title = "Add answer";
    buttonadd.onclick = addContestant.bind(holder2);
    let input = document.createElement("input");
    input.id = "input_title_" + overallid;
    input.placeholder = "Set title";
    input.onkeyup = function() { updateTitle(overallid); };
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

function addContestant(name_? : string) {
    let t = this.parentNode.parentNode;
    let cholder = document.createElement("div");
    var cid = parseInt(t.getAttribute("contestants")) + 1;
    t.setAttribute("contestants", cid);
    cholder.className = "answerholder";
    cholder.title = "Contestant";
    let buttondel = document.createElement("button");
    buttondel.className = "delete_icon";
    buttondel.title = "Remove contestant";
    buttondel.onclick = removeContestant.bind(cholder);
    let name = document.createElement("input");
    name.placeholder = "Name";
    name.type = "text";
    if (typeof name_ === "string") {
        name.value = name_;
    }
    addChildren(cholder, buttondel, name);
    this.appendChild(cholder);
}

function removeContestant() {
    let c = confirm("Are you sure that you want to remove this contestant?");
    if (c) {
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
    } else {
        //for (var i = 0; i < this.childNodes.length; i++) {
        //    this.childNodes[i].style.display = "block";
        //}
        this.parentNode.childNodes[1].style.display = "block";
        this.setAttribute("open", true);
    }
}

function removeGroup() {
    let c = confirm("Are you sure that you want to delete this group?");
    if (c) {
        this.outerHTML = "";
        delete this;
    }
}