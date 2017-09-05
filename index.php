<!DOCTYPE html>
<html>
    <head>
        <title>
            Wie Is De Mol
        </title>
        <link rel="stylesheet" type="text/css" href="style/style.css">
        <!--<script src="script/load.js"></script>!-->
        <script src="script/test.js"></script>
    </head>
    <body id="body" onload="initTest();">
        <div class="widm-logo-blur-holder">
            <img src="images/WIDM_LOGO_BLACK_BLURRED.jpg" class="widm-logo-blur" alt="" />
        </div>
        <div id="content" class="TB contentholder">
        <!-- LOGON SCREEN !-->
            <div class="TR" id="LOGON">
                <div class="TD logon">
                    <div>
                        <div id="errMSSG">Probeer het opnieuw.</div>
                        <input id="name" type="text" placeholder="Naam" class="logon_input">
                        <br>
                        <input id="pin" type="password" placeholder="Pin" class="logon_input">
                        <br>
                        <button onclick="initializeTest();" class="logon_submit">Verder</button>
                    </div>
                </div>
            </div>
        <!-- END !-->
        <!-- QUESTION !-->
            <div class="TR" id="QUESTIONA">
                <div class="TD">
                    <img src="images/WIDM_LOGO_BLACK.jpg" id="WIDM_LOGO" />
                </div>
                <div class="TD">
                    <span class="H1" id="QQuestion">9. &nbsp; Wat is het geluksgetal van de Mol?</span>
                </div>
            </div>
            <div class="TR" id="QUESTIONB">
                <div class="TD"></div>
                    <div class="input-bttn-wrapper" id="QAnswers">
                        <div class="input-bttn-holder">
                            <button type="submit" class="input-bttn">&nbsp;</button>
                            <span class="input-bttn-txt">6<span>
                        </div>
                        <div class="input-bttn-holder">
                            <button type="submit" class="input-bttn">&nbsp;</button>
                            <span class="input-bttn-txt">7<span>
                        </div>
                        <div class="input-bttn-holder">
                            <button type="submit" class="input-bttn">&nbsp;</button>
                            <span class="input-bttn-txt">8<span>
                        </div>
                        <div class="input-bttn-holder">
                            <button type="submit" class="input-bttn">&nbsp;</button>
                            <span class="input-bttn-txt">9<span>
                        </div>
                        <div class="input-bttn-holder">
                            <button type="submit" class="input-bttn">&nbsp;</button>
                            <span class="input-bttn-txt">12<span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>