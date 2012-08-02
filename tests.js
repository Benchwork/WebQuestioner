/*
 * Manual test list
 *
 * questions.js:
 * - Copy, paste and modify a question in questions.js
 *      - Check it's in the 'pages' array via js console
 *      - Check the question displays in the GUI
 *      - Check the order of the question is correct
 * - Have at least one question of each input type
 *      - Check it displays correctly
 *      - Check interaction is as expected
 *          - radios are single-select only
 *          - checkboxes are multiselect
 *          - Textboxes autofocus
 *      - Check after each change to the input that the file on
 *        the server updates with the new values.
 *  - Conditional questions perform as expected
 *      - Questions with alwaysAsk are never skipped
 *      - Questions with conditions are skipped if the
 *        condition are not met
 *      - Questions with conditions are not skipped if the
 *        conditions are met
 *
 *  Interface:
 *  - The buttons appear in the correct placement
 *      - prev top left
 *      - next top right
 *  - The heading displays the title text for each question
 *  - The question explanation is in small font below the question
 *  - All the options for the question are shown
 *  - Many options creates the correct scrolling behaviour - TODO TEST
 *      - Buttons are always visible at the top of the page
 *
 *  Button actions:
 *  - Next causes the next question to display
 *      - Check that this is true when skipping 0, 1, and 2 questions
 *  - Prev causes the previous question to display
 *      - Check that this is true when skipping 0, 1, and 2 questions
 *  - Modifications to previous questions do not create duplicate entries
 *    for that question.
 *  - When there is existing content on a question the existing content
 *    is displayed.
 *
 *  Cookies / Username:
 *  - If no cookie exists, username is requested
 *  - If cookie exists
 *      - username is not requested
 *      - username is read from cookie
 *  - When file is saved on server it includes the correct username
 *  - Closing or reloading the page retains the cookie information
 *
 *  Server:
 *  - requests to index.html work
 *      - from localhost
 *      - from LAN if host ip is known
 *      - not from general internet (depending on router config) - TODO TEST
 *  - check can server .html .css and .js files without errors
 *  - reports 404 errors if requested resource doesn't exist
 *  - creates session ID
 *      - is unique between sessions
 *      - is accessible from client / javascript console (ie
 *        string interpolation is correctly formed)
 *  - POST data is saved correctly
 *      - filename is correctly formatted
 *      - overwrites existing session file if it exists
 *      - file contains expected content
 *  - Server displays meaningful feedback
 *      - When it starts it displays a message to allow the user
 *        to easily access the index page
 *      - Whenever a successful requests occurs there is a one-line
 *        message displayed - TODO FAILS ON POST
 *      - Whenever an error occurs some detail is provided to allow
 *        the monitoring person to understand why it happened.
 */