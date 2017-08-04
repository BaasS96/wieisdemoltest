function loadData(file) {
    var nameholder = document.getElementById("test_name");
    var questions = document.getElementById("questionholder");
    nameholder.value = file.name;
    for(var i = 0; i < file.answers.length; i++) {
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