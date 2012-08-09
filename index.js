function Quiz() {

    this.questions = [];
    this.current_question_index = -1;
    this.container = document.getElementById("content");
    
    this.add_question = function(question) {
        question.quiz = this;
        this.questions.push(question)
        if (this.questions.length == 1) {
            this.start();
        }
    }

    this.start = function() {
        this.current_question_index = 0;
        this.display_current_question();
    }

    this.next = function() {
        this.current_question_index = this.get_next_question_index();
        if(this.current_question_index < this.questions.length - 1) {
            this.display_current_question();
        }
        else {
            this.display_closing_statement();
        }
    }

    this.prev = function() {
        this.current_question_index = this.get_prev_question_index();
        this.display_current_question();
    }

    this.get_next_question_index = function() {
        var next_index = this.current_question_index + 1;
        while (!(this.is_valid_question(next_index))) {
            next_index = next_index + 1;
        }
        return next_index;
    }

    this.get_prev_question_index = function() {
        var prev_index = this.current_question_index - 1;
        while (!(this.is_valid_question(prev_index))) {
            prev_index = prev_index - 1;
        }
        return prev_index;
    }

    this.is_valid_question = function(index_to_check) {
        /* Conditions are OR - only one must be met to be true */
        var conditions = this.questions[index_to_check].conditions();
        var is_valid = Object.keys(conditions).length == 0;
        for (var condition_key in conditions) {
            var condition_value = conditions[condition_key];
            for (var i=index_to_check-1; i>=0; i--) {
                var question_to_check = this.questions[i];
                var response = question_to_check.response;
                if (question_to_check.title() == condition_key) {
                    if (typeof response === "string") {
                        if (question_to_check.response == condition_value) {
                            is_valid = true;
                            break;
                        }
                    }
                    else if (response != null){
                        for (var j=0,len=response.length; j<len; j++) {
                            var response_j = response[j];
                            if (response_j == condition_value) {
                                is_valid = true;
                                break;
                            }
                        }
                    }
                }
            }
            if(is_valid) {
                break;
            }
        }
        return is_valid;
    }

    this.display_current_question = function() {
        this.container.textContent = "";
        var question = this.questions[this.current_question_index];
        this.container.appendChild(question.html());
        this.display_next_button();
        if(this.current_question_index != 0) {
            this.display_previous_button();
        }
    }

    this.display_closing_statement = function() {
        this.container.textContent = "";
        this.display_previous_button();
        var closing_statement = new Instruction()
        .title("")
        .explanation("Thankyou for completing the questions.");
        this.container.appendChild(closing_statement.html());
    }

    this.display_next_button = function() {
        var button = document.createElement("button");
        button.textContent = "Next";
        button.className = "nav_button nav_button_right";
        button.quiz = this;
        button.addEventListener("click", function() {this.quiz.next()}, false);
        this.container.appendChild(button);
    }

    this.display_previous_button = function() {
        var button = document.createElement("button");
        button.textContent = "Prev";
        button.className = "nav_button nav_button_left";
        button.quiz = this;
        button.addEventListener("click", function() {this.quiz.prev()}, false);
        this.container.appendChild(button);
    }

    this.save_question_to_server = function(question) {
        var params = {
            "add": [{
                "title": question.title(),
                "response": question.response
            }],
            "remove": []
        }
        params["remove"] = this.find_voided_responses();
        //TODO also the reverse is true - if a response is changed which
        // validates an existing future response, the newly validated responses
        // must be resaved... getting a bit hectic, seems like the design
        // could be better.
        //this.find_revalidated_responses(question);
        
        //TODO the following is too low level for this function,
        // move it elsewhere. Also no error handling etc, super basic.
        var ajax = new XMLHttpRequest();
        ajax.open("POST", "/save", true);
        var params_str = JSON.stringify(params);
        ajax.send(params_str);
    }

    this.find_voided_responses = function() {
        // Go through the entire question chain
        // and find responses that are not null and
        // that don't meet the conditions required.
        // This can happen when using prev and changing
        // a response - questions further down the chain
        // can be voided.
        // TODO I'm thinking this can be improved
        var responses_to_remove = [];
        var response_tally = {};
        for (var i=1,len=this.questions.length; i<len; i++) {
            var question_to_check = this.questions[i];
            var title = question_to_check.title()
            var conditions = question_to_check.conditions();
            var future_response = question_to_check.response;
            response_tally[title] = question_to_check.response;
            for (var condition_title in conditions) {
                if (condition_title in response_tally) {
                    expected_response = conditions[condition_title]
                    supplied_response = response_tally[condition_title];

                    // expected_response will always be a string.
                    // supplied_response is always a string, except for
                    // CheckboxQuestion responses, which are arrays.
                    var question_will_be_asked = expected_response == supplied_response;
                    if (supplied_response && typeof supplied_response == "object") { // for checkbox responses
                        for (var j=0,len=supplied_response.length; j<len; j++) {
                            question_will_be_asked = expected_response == supplied_response[j];
                            if(question_will_be_asked) {
                                break;
                            }
                        }
                    }

                    if (!question_will_be_asked &&
                        future_response != null) {
                        responses_to_remove.push(title);
                    }
                }
            }
        }
        return responses_to_remove;
    }
}







/* Abstract Class */
function Page() {

    /* Public properties */
    
    this.title_text = "";
    this.explanation_text = "";
    this.conditions_array = {};
    this.html_container = null;
    this.html_generator = null;
    this.quiz = null;

    /* Public methods - inspired by jQuery style */
    
    this.title = function(new_title_text) {
        if(typeof new_title_text != "undefined") {
            this.title_text = new_title_text;
            this.update_html();
            return this;
        }
        else {
            return this.title_text;
        }
    }

    this.explanation = function(new_explanation_text) {
        if(typeof new_explanation_text != "undefined") {
            this.explanation_text = new_explanation_text;
            this.update_html();
            return this;
        }
        else {
            return this.explanation_text;
        }
    }

    this.conditions = function(new_conditions_array) {
        if(typeof new_conditions_array != "undefined") {
            this.conditions_array = new_conditions_array;
            return this;
        }
        else {
            return this.conditions_array;
        }
    }

    /* TODO make this a decorator */
    this.update_html = function() {
        this.html_container = document.createElement("div");
        this.html_container.className = "question_container";

        var title = document.createElement("div");
        title.className = "question_title";
        title.textContent = this.title_text;
        this.html_container.appendChild(title);

        var explanation = document.createElement("div");
        explanation.className = "question_explanation";
        explanation.textContent = this.explanation_text;
        this.html_container.appendChild(explanation);

        if(this.html_generator) {
            var extra_html_content = this.html_generator();
            this.html_container.appendChild(extra_html_content);
        }
    };

    this.html = function() {
        return this.html_container;
    }
    
    return this; //allows chaining of methods a la jQuery
}


function Instruction() {
    // Makes questions.js more readable.
    // In classic OOP Page would not be able to be instantiated, so this
    // subclass would be required.
}
Instruction.prototype = new Page();
Instruction.prototype.constructor = Instruction;








/* Abstract Class */
function Question() {
    this.response = null;
}
Question.prototype = new Page();
Question.prototype.constructor = Question;



function ShorttextQuestion(input_type) {

    this.html_generator = function() {
        
        if (!(input_type)) {
            input_type = "text";
        }
        
        var response_container = document.createElement("div");
        response_container.className = "question_response";
        
        var input = document.createElement("input");
        input.type = input_type;
        input.question = this;
        input.addEventListener("keyup", input_keyup_handler, false);
        response_container.appendChild(input);
        return response_container;
    }
}
ShorttextQuestion.prototype = new Question();
ShorttextQuestion.prototype.constructor = ShorttextQuestion;

function NumericQuestion() {}
NumericQuestion.prototype = new ShorttextQuestion("number");
NumericQuestion.prototype.constructor = NumericQuestion;

function LongtextQuestion() {

    this.html_generator = function() {

        var response_container = document.createElement("div");
        response_container.className = "question_response";
        
        var input = document.createElement("textarea");
        input.setAttribute("cols", 40);
        input.setAttribute("rows", 8);
        input.question = this;
        input.addEventListener("keyup", input_keyup_handler, false);
        response_container.appendChild(input);
        return response_container;
    }
}
LongtextQuestion.prototype = new Question();
LongtextQuestion.prototype.constructor = LongtextQuestion;

function MultiChoiceQuestion(input_type, change_handler) {

    this.options_array = [];

    if (!(input_type)) {
        input_type == "radio";
    }

    this.options = function(new_options_array) {
        if(typeof new_options_array != "undefined") {
            this.options_array = new_options_array;
            this.update_html();
            return this;
        }
        else {
            return this.options_array;
        }
    }

    this.html_generator = function() {
        var response_container = document.createElement("div");
        response_container.className = "question_response";
        for (var i=0,len=this.options_array.length; i<len; i++) {

            var option_container = document.createElement("div");
            option_container.className = "question_option";
            response_container.appendChild(option_container);
            
            var option_text = this.options_array[i];
            var option_id = input_type + "_" + i;
            var input = document.createElement("input");
            input.type = input_type;
            input.id = option_id;
            input.value = option_text;
            input.name = "multi_choice_set";
            input.question = this;
            input.addEventListener("change", change_handler, false);
            option_container.appendChild(input);

            var label = document.createElement("label");
            label.setAttribute("for", option_id);
            label.textContent = option_text;
            option_container.appendChild(label);
        }
        return response_container;
    }
}
MultiChoiceQuestion.prototype = new Question();
MultiChoiceQuestion.prototype.constructor = MultiChoiceQuestion;

function RadiobuttonsQuestion() {}
RadiobuttonsQuestion.prototype = new MultiChoiceQuestion("radio", radio_change_handler);
RadiobuttonsQuestion.prototype.constructor = RadiobuttonsQuestion;

function CheckboxesQuestion() {}
CheckboxesQuestion.prototype = new MultiChoiceQuestion("checkbox", checkbox_change_handler);
CheckboxesQuestion.prototype.constructor = CheckboxesQuestion;



/* Input event handlers */
// TODO Can probably abstract some parts out to a base class

function input_keyup_handler(e) {
    var question = e.target.question;
    if (e.target.value.length > 0) {
        question.response = e.target.value;
        //TODO this saves number input responses as strings
    }
    else {
        question.response = null;
    }
    question.quiz.save_question_to_server(question);
}

function radio_change_handler(e) {
    var question = e.target.question;
    question.response = e.target.value;
    question.quiz.save_question_to_server(question);
}

function checkbox_change_handler(e) {
    var question = e.target.question;
    if (question.response == null) {
        question.response = [];
    }
    if (e.target.checked) {
        question.response.push(e.target.value);
    }
    else {
        question.response.removeByValue(e.target.value);
        if(question.response.length == 0) {
            question.response = null;
        }
    }
    question.quiz.save_question_to_server(question);
}




/* Utility functions */

Array.prototype.removeByValue = function(value) {
    for (var i=this.length-1; i>=0; i--) {
        if(this[i] == value) {
            this.splice(i, 1);
        }
    }
}

String.prototype.get_illegal_chars = function() {
    /* http://support.grouplogic.com/?p=1607 */
    var illegal = "/?<>\:*|”.\\"
    var found = ""
    for (var i=0,len=illegal.length; i<len; i++) {
        var char = illegal[i];
        if(this.indexOf(char) > -1) {
            found += char;
        }
    }
    return found;
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
    //Only ask username once, then save it for the future.
    // username is used in the filename so must not contain illegal chars
    var username=getCookie("username");
    if (username==null || username=="") {
        username=prompt("Please enter your name. This question is only asked once, then stored for all future sessions.","");
        var illegal = username.get_illegal_chars()
        while(illegal.length > 0) {
            username=prompt("Please enter your name. Don't use " + illegal + "","");
            illegal = username.get_illegal_chars()
        }
    }
    if (username!=null && username!="") {
        setCookie("username",username);
    }
    if(username != "") {
        return username;
    }
    else {
        return "NoUsernameProvided";
    }
    //TODO make a way to easily change this value in the GUI
}

