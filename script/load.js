function loadData(file) {

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
    });
}