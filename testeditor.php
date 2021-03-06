<!DOCTYPE html>
<html>
    <head>
        <title>
            WIDM Test editor
        </title>
        <link rel='stylesheet' href='style/testeditor.css'>
        <script src="script/contestanteditor.js"></script>
        <script src="script/testeditor.js"></script>
        <script src="script/load.js"></script>
        <script src="script/save.js"></script>
    </head>
    <body id="body">
            <section id="editorholder">
                <div id="mainmenuholder">
                    <button type="button" class="save_icon" title="Save test" onclick="saveData();" id="save">&nbsp;</button>
                    &emsp;
                    <button type="button" class="addq_icon" title="Add question" onclick="addquestion();" id="add">&nbsp;</button>
                    <button type="button" class="showall_icon" title="Show all questions" onclick="showall();">&nbsp;</button>
                    <button type="button" class="hideall_icon" title="Hide all questions" onclick="hideall();">&nbsp;</button>
                </div>
                <div id="editorfooter">
                    <span class="lastsaved">Last saved: </span><span id="lastsaved">never</span>
                    <input type="text" id="test_name" placeholder="Test name">
                </div>
                <div class="uberholder">
                    <div id="questionholder">
                    </div>
                    <div id="holderright" class="holderright">
                       
                    </div>
                </div>
            </section>
    </body>
</html>