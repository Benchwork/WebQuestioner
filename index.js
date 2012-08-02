var pages = [];
var responses = {};
var currentPageIndex = -1;

var alwaysAsk = {}; //so the user can set conditions = alwaysAsk; in questions.js - just is easier to read

function addPage(page) {
    var thisPage = document.createElement("div");

    var titleDiv = document.createElement("div");
    var titleText = document.createElement("h1");
    if(page["title"] && page["title"].length > 0) {
        titleText.textContent = page["title"];
    }
    else {
        titleText.textContent = "&nbsp";
    }
    titleDiv.className = "title";
    titleDiv.appendChild(titleText);
    thisPage.appendChild(titleDiv);

    var explanationDiv = document.createElement("div");
    explanationDiv.textContent = page["explanation"];
    explanationDiv.className = "explanation";
    thisPage.appendChild(explanationDiv);

    var inputDiv = createInputs(page["inputType"], page["options"], page["title"]);
    thisPage.appendChild(inputDiv);

    var buttons = createFooterButtons();
    thisPage.appendChild(buttons);

    thisPage.conditions = page["conditions"]; //TODO stop using properties in the DOM for data

    pages.push(thisPage);
}

function transitionPage(e) {
    //Looks for the next page in the list. If there are conditions on the next page,
    //the conditions must be met or it will not be displayed, it will move to the next one.

    var display = document.getElementById("display");
    display.textContent = ""; //TODO is relatively slow - see http://jsperf.com/empty-content-innerhtml-vs-dom/2

    if(e && e.target && e.target.getAttribute("navigateBackwards") == "true") { //TODO investigate true as a string, seems dubious
        currentPageIndex = currentPageIndex - 1;
        if(currentPageIndex < 0) {
            currentPageIndex = 0;
        }
        var passesConditions = testPageConditions(pages[currentPageIndex].conditions);
        if(passesConditions) {
            display.appendChild(pages[currentPageIndex]);
            focus_input();
        }
        else {
            transitionPage(e);
        }
    }
    else {
        if(currentPageIndex < pages.length - 1) {
            currentPageIndex = currentPageIndex + 1;
            var passesConditions = testPageConditions(pages[currentPageIndex].conditions);
            if(passesConditions) {
                display.appendChild(pages[currentPageIndex]);
                focus_input();
            }
            else {
                transitionPage();
            }
        }
        else {
            //Display the end page - hardcoded is a bit inflexible
            currentPageIndex = pages.length;
            display.innerHTML = "<br><br>Thankyou for completing the questions."
            var prevButton = createPrevButton();
            display.appendChild(prevButton);
            var  poweredBy = document.createElement("div");
            poweredBy.innerHTML = "Powered by <a href='https://github.com/thedawnrider/WebQuestioner'>Web Questioner</a>";
            poweredBy.style.position = "absolute";
            poweredBy.style.bottom = 5;
            display.appendChild(poweredBy);
        }

    }
}

function createInputs(type, options, title) {
    var inputDiv = document.createElement("div");
    inputDiv.className = "inputs";

    //TODO add a type which can have multiple text inputs with an 'add' button, textlist
    //TODO when pressing 'previous' and the previous value is changed resulting in a different
    //     path through the questions, the old 'next' values which can now never be reached
    //     must be removed. MOST URGENT

    switch (type) {
        case "shorttext":
            var input = document.createElement("input");
            input.setAttribute("type","text");
            input.setAttribute("name", title);
            input.addEventListener('keyup', saveTextInput, false);
            inputDiv.appendChild(input);
            break;

        case "radiobuttons":
            for(var i=0,len=options.length; i<len; i++) {
                var id = title + options[i];
                var input = document.createElement("input");
                input.setAttribute("type","radio");
                input.setAttribute("name", title);
                input.setAttribute("value", options[i]);
                input.className = "wellSpacedInput";
                input.id = id;
                input.addEventListener("change", saveRadiobuttonsInput, false);
                inputDiv.appendChild(input);
                var label = document.createElement("label");
                label.textContent = options[i];
                label.setAttribute("for", id);
                label.setAttribute("onclick", ""); //For mobile safari - see http://forums.macrumors.com/showthread.php?t=785632
                inputDiv.appendChild(label);
                inputDiv.appendChild(document.createElement("br"));
            }
            break;

        case "numeric":
            //TODO make this a genuine numeric input, currently is a clone of shorttext
            var input = document.createElement("input");
            input.setAttribute("type","number");
            input.setAttribute("name", title);
            input.addEventListener('keyup', saveTextInput, false);
            inputDiv.appendChild(input);
            break;

        case "checkboxes":
            for(var i=0,len=options.length; i<len; i++) {
                var id = title + options[i];
                var input = document.createElement("input");
                input.setAttribute("type","checkbox");
                input.setAttribute("name", title);
                input.setAttribute("value", options[i]);
                input.className = "wellSpacedInput";
                input.id = id;
                input.addEventListener("change", saveCheckboxesInput, false);
                inputDiv.appendChild(input);
                var label = document.createElement("label");
                label.textContent = options[i];
                label.setAttribute("for", id);
                label.setAttribute("onclick", ""); //For mobile safari - see http://forums.macrumors.com/showthread.php?t=785632
                inputDiv.appendChild(label);
                inputDiv.appendChild(document.createElement("br"));
            }
            break;

        case "longtext":
            var input = document.createElement("textarea");
            input.setAttribute("name", title);
            input.setAttribute("rows", 5);
            input.setAttribute("cols", 40);
            input.addEventListener('keyup', saveTextInput, false);
            inputDiv.appendChild(input);
            break;

        case "noInput":
            //Nothing to do, just leave it blank
            break;

        default:
            inputDiv.textContent = "Unrecognised input type - " + inputType;
            break;
    }

    return inputDiv;
}

function focus_input(inputType) {
    //shorttext and numeric
    var inputs = document.getElementsByTagName("input");
    if(inputs.length > 0) {
        var input = inputs[0];
        var inputType = input.getAttribute("type");
        if(inputType == "text" || inputType == "numeric") {
            input.focus();
        }
    }
    //textarea
    var textareas = document.getElementsByTagName("textarea");
    if(textareas.length > 0) {
        textareas[0].focus();
    }
    
}

function createFooterButtons() {
    var buttonsDiv = document.createElement("div");
    buttonsDiv.className = "buttons";

    if(pages.length > 0) {
        var prevButton = createPrevButton();
        buttonsDiv.appendChild(prevButton);
    }

    var nextButton = createNextButton();
    buttonsDiv.appendChild(nextButton);
    //TODO pressing 'enter' should correspond to pressing 'next'

    return buttonsDiv;
}

function createPrevButton() {
    var prevButton = createFooterButton("Prev");
    prevButton.setAttribute("navigateBackwards", true);
    prevButton.style.left = 5;
    return prevButton;
}

function createNextButton() {
    var nextButton = createFooterButton("Next");
    nextButton.style.right = 5;
    return nextButton;
}

function createFooterButton(text) {
    var button = document.createElement("button");
    button.textContent = text;
    button.className = "footerButton";
    button.addEventListener('click', transitionPage, false);
    return button
}

function testPageConditions(conditions) {
    var numberOfMatches = 0;
    var numberOfConditions = 0;
    for(var key in conditions) {
        numberOfConditions = numberOfConditions + 1;
        if(key in responses) {
            if(typeof(responses[key]) == "string") { //The match will be directly to an existing response
                if(conditions[key] == responses[key]) {
                    numberOfMatches = numberOfMatches + 1;
                }
            }
            else if(typeof(responses[key]) == "object") { //The match will be part of a response array
                for (var i in responses[key]) {
                    if(conditions[key] == responses[key][i]) {
                        numberOfMatches = numberOfMatches + 1;
                    }
                }
            }
        }
    }
    return numberOfMatches == numberOfConditions;
}

function saveRadiobuttonsInput(e) {
    var input = e.target;
    responses[input.getAttribute("name")] = input.getAttribute("value");
    saveToServer();
}

function saveCheckboxesInput(e) {
    var input = e.target;
    var key = input.getAttribute("name");
    if(!(key in responses)) {
        responses[key] = [];
    }
    var thisArray = responses[key];
    var val = input.getAttribute("value");
    if(e.target.checked) {
        thisArray.push(val);
    }
    else {
        thisArray.splice(thisArray.indexOf(val), 1);
    }
    saveToServer();
}

function saveTextInput(e) {
    var input = e.target;
    responses[input.getAttribute("name")] = input.value;
    saveToServer();
}





/* from http://www.w3schools.com/js/js_cookies.asp */
function setCookie(c_name,value) {
    var exdate=new Date();
    exdate.setDate(exdate.getDate() + 365*80);
    var c_value=escape(value) + "; expires="+exdate.toUTCString();
    document.cookie=c_name + "=" + c_value;
}

function getCookie(c_name) {
    var i,x,y,ARRcookies=document.cookie.split(";");
    for (i=0;i<ARRcookies.length;i++) {
        x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
        y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
        x=x.replace(/^\s+|\s+$/g,"");
        if (x==c_name) {
            return unescape(y);
        }
    }
}

function checkForLocallyStoredUsername()
{
    //Only ask username once, then save it for the future
    var username=getCookie("username");
    if (username==null || username=="") {
        username=prompt("Please enter your name. This question is only asked once, then stored for all future sessions.","");
    }
    if (username!=null && username!="") {
        setCookie("username",username);
    }
    if(username != "") {
        responses['username'] = username;
    }
    else {
        responses['username'] = "NoUsernameProvided";
    }
    //TODO need a way to easily change this value in the GUI
}






function saveToServer() {
    var req = new XMLHttpRequest();
    req.open("POST", "index.html", true);
    params = createServerContent();
    req.send(params);
    //TODO use the response to display a quick 'saved' in the top right
}

function createServerContent() {
    var toServer = {};
    var content = "";
    toServer['time'] = new Date().getTime();
    toServer['jsonData'] = responses;
    toServer['sessionId'] = sessionId;
    toServer['filename'] = responses['username'] + " - " + sessionId + ".json"; //TODO sessionId in the filename is ugly

    if(filenameIdentifiers) {
        if(canCreateFilenameFromResponses(filenameIdentifiers)) {
            toServer['filename'] = createFilename(filenameIdentifiers);
        }
    }

    content = JSON.stringify(toServer);
    return content;
}

function createFilename(identifiers) {
    var filename = responses['username'];
    for (var i=0,len=identifiers.length; i<len; i++) {
        var key = identifiers[i];
        filename += " - " + responses[key];
    }
    filename += " - " + sessionId + ".json";
    return filename;
}

function canCreateFilenameFromResponses(identifiers) {
    var canCreate = checkParameterIsInResponses('username');
    for (var i=0,len=identifiers.length; i<len; i++) {
        var param = identifiers[i];
        canCreate = canCreate && checkParameterIsInResponses(param);
    }
    return canCreate;
}

function checkParameterIsInResponses(paramName) {
    return paramName in responses &&
            responses[paramName] &&
            responses[paramName] != "";
}