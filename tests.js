function test_suite() {

    this.tests = [];
    this.successful_tests = 0;
    this.total_tests = 0;

    this.add_test = function(test) {
        this.tests.push(test)
    }

    this.run = function() {
        for (var i=0,len=this.tests.length; i<len; i++) {
            var test = this.tests[i];
            var passed = test.run();
            this.total_tests += 1;
            if(passed) {
                this.successful_tests += 1;
            }
            else {
                console.log("FAILED (" + (i+1) + "): " + test.name);
                //TODO would be nice to log this from the 'return 'of the test
            }
        }
        console.log("Passed " + this.successful_tests + " of " + this.total_tests);
    }
}

function test(name, fn) {
    this.name = name;
    this.run = function() {
        return fn();
    }
}

var tests = new test_suite();

/*********************
 * UNIT TESTS
 */

/* Quiz tests */

tests.add_test(
    new test(
        "Quiz.add_question()",
        function() {
            var q = new Quiz();
            var p = new Instruction();
            q.add_question(p);
            return q.questions.length == 1;
        }
    )
);

tests.add_test(
    new test(
        "Quiz.add_questions()",
        function() {
            var q = new Quiz();
            var p1 = new Instruction();
            var p2 = new Instruction();
            q.add_questions([p1, p2]);
            return q.questions.length == 2;
        }
    )
);

tests.add_test(
    new test(
        "Quiz.start()",
        function() {
            var q = new Quiz();
            p = new Page();
            var test_string = "This is a random title";
            p.title(test_string)
            q.add_question(p);
            q.start();
            var page_content = document.getElementById("content").innerHTML;
            return page_content.indexOf(test_string) > -1;
        }
    )
);

tests.add_test(
    new test(
        "Quiz.next()",
        function() {
            var q = new Quiz();
            p1 = new Page();
            p2 = new Page();
            var test_string1 = "This is the first title";
            var test_string2 = "This is the second title";
            p1.title(test_string1);
            p2.title(test_string2);
            q.add_questions([p1, p2]);
            q.start();
            q.next();
            var page_content = document.getElementById("content").innerHTML;
            return page_content.indexOf(test_string2) > -1;
        }
    )
);

tests.add_test(
    new test(
        "Quiz.prev()",
        function() {
            var q = new Quiz();
            p1 = new Page();
            p2 = new Page();
            var test_string1 = "This is the first title";
            var test_string2 = "This is the second title";
            p1.title(test_string1);
            p2.title(test_string2);
            q.add_questions([p1, p2]);
            q.start();
            q.next();
            q.prev();
            var page_content = document.getElementById("content").innerHTML;
            return page_content.indexOf(test_string1) > -1;
        }
    )
);

//TODO
// get_next_question_index
// get_prev_question_index
// is_valid_question
// display_current_question
// display_closing_statement
// display_next_button
// display_previous_button
// save_question_to_server
// find_voided_responses


/* Page tests */

tests.add_test(
    new test(
        "Page.title()",
        function() {
            var p = new Page();
            p.title("test_string");
            return p.title() == "test_string";
        }
    )
);

tests.add_test(
    new test(
        "Page.explanation()",
        function() {
            var p = new Page();
            p.explanation("test_string");
            return p.explanation() == "test_string";
        }
    )
);

tests.add_test(
    new test(
        "Page.conditions()",
        function() {
            var p = new Page();
            p.conditions({"test": 1});
            return p.conditions()["test"] == 1;
        }
    )
);

tests.add_test(
    new test(
        "Page.update_html()",
        function() {
            var p = new Page();
            p.title("test_title");
            p.explanation("test_explanation");
            p.update_html();
            var container = p.html_container;
            var title = p.html_container.childNodes[0];
            var explanation = p.html_container.childNodes[1];
            return container.className == "question_container" &&
                title.textContent == "test_title" &&
                title.className == "question_title" &&
                explanation.textContent == "test_explanation" &&
                explanation.className == "question_explanation";
        }
    )
);

tests.add_test(
    new test(
        "Page.html()",
        function() {
            var p = new Page();
            return p.html() == p.html_container;
        }
    )
);

/* ShorttextQuestion tests */

tests.add_test(
    new test(
        "ShorttextQuestion.html_generator()",
        function() {
            var s = new ShorttextQuestion();
            s.update_html();
            var container = s.html_container;
            var input_container = container.childNodes[2];
            var input = input_container.childNodes[0];
            return input.getAttribute("type") == "text";
        }
    )
);

/* NumericQuestion tests */

tests.add_test(
    new test(
        "NumericQuestion.html_generator()",
        function() {
            var s = new NumericQuestion();
            s.update_html();
            var container = s.html_container;
            var input_container = container.childNodes[2];
            var input = input_container.childNodes[0];
            return input.getAttribute("type") == "number";
        }
    )
);

/* MultiChoiceQuestion tests */

tests.add_test(
    new test(
        "MultiChoiceQuestion.options()",
        function() {
            var p = new MultiChoiceQuestion();
            p.options(["1", "2", "3"]);
            return p.options().length == 3;
        }
    )
);

tests.add_test(
    new test(
        "MultiChoiceQuestion.html_generator()",
        function() {
            var s = new MultiChoiceQuestion();
            s.options(["1", "2", "3"]);
            s.update_html();
            var container = s.html_container;
            var input_container = container.childNodes[2];
            var inputs = input_container.getElementsByTagName("input");
            return inputs.length == 3;
        }
    )
);


/* removeByValue */

tests.add_test(
    new test(
        "Array.prototype.removeByValue()",
        function() {
            var a = ["a", "b", "c", "a"];
            a.removeByValue("a");
            return a.length == 2 &&
                a[0] == "b" &&
                a[1] == "c";
        }
    )
);

/* get_illegal_chars */

tests.add_test(
    new test(
        "String.prototype.get_illegal_chars()",
        function() {
            var a = "abc123<>\:*|”.\\xyz789/?".get_illegal_chars();
            return a == "/?<>\:*|”.\\";
        }
    )
);


/*********************
 * ADDITIONAL TESTS
 */


tests.add_test(
    new test(
        "Page - chained functions",
        function() {
            var p = new Page()
            .title("test_title")
            .explanation("test_explanation")
            .conditions({"test": 1});
            return p.title() == "test_title" &&
                p.explanation() == "test_explanation" &&
                p.conditions()["test"] == 1;
        }
    )
);

//Quiz.start() Quiz.next() Quiz.prev() with no questions
//Quiz.next() more times than there are questions
//Quiz.prev() from the first page

/* TODO TEST
 * Multiple questions don't conflict with each other
 * Ajax tests
 * server side tests, in a different file
 */


tests.run();

