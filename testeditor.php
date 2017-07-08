<!DOCTYPE html>
<html>
    <head>
        <title>
            WIDM Test editor
        </title>
        <link rel='stylesheet' href='testeditor.css'>
        <script src="testeditor.js"></script>
    </head>
    <body id="body">
        <form action="updatetest.php" method="post">
            <section id="editorholder">
                <div id="mainmenuholder">
                    <button type="button" class="save_icon" title="Save test">&nbsp;</button>
                    &emsp;
                    <button type="button" class="addq_icon" title="Add question" onclick="addquestion();">&nbsp;</button>
                    <button type="button" class="showall_icon" title="Show all questions" onclick="showall();">&nbsp;</button>
                    <button type="button" class="hideall_icon" title="Hide all questions" onclick="hideall();">&nbsp;</button>
                </div>
                <div id="questionholder">
                </div>
                <div id="editorfooter">
                    Something is yet to come here...
                </div>
            </section>
        </form>
    </body>
</html>