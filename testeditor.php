<!DOCTYPE html>
<html>
    <head>
        <title>
            WIDM Test editor
        </title>
        <link rel='stylesheet' href='style/testeditor.css'>
        <script src="script/testeditor.js"></script>
        <script src="script/save.js"></script>
    </head>
    <body id="body">
        <form action="updatetest.php" method="post">
            <section id="editorholder">
                <div id="mainmenuholder">
                    <button type="button" class="save_icon" title="Save test" onclick="saveData();">&nbsp;</button>
                    &emsp;
                    <button type="button" class="addq_icon" title="Add question" onclick="addquestion();">&nbsp;</button>
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
                    <div class="holderright">
                        <div class="rightpanel">
                            <div class="rightpanel_header">
                                <button type="button" class="showall_icon" title="Show all questions" onclick="showall();">&nbsp;</button>
                                <span class="rightpanel_header_text">Info</span>
                            </div>
                            <div class="rightpanel_content">
                                Geen content
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </form>
    </body>
</html>