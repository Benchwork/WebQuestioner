//This is where the questions and the logic of what questions to ask
//is set.
//The order that the questions as written here is the order they will be
//displayed.
//Use the 'conditions' parameter for each page to say whether
//that page should be displayed or not based on previous responses.

// The input parameters for each item is:
//
// title - eg "Vehicle" - NOTE: title must be unique,
//         don't have 'Colour' as the title for the page of,
//         say, the colour of a car, and 'Colour' later
//         as the title of, say, the colour of the car interior.
//         Instead use 'Car Colour' and 'Interior Colour' as
//         the titles.
//
// explanation - eg "What type of vehicle do you use"
//
// options - eg ["Car", "Bike", "Plane"] - for freeform text input use [], ie no options
//
// input type - eg "radiobuttons", select from
//              radiobuttons
//              checkboxes
//              shorttext
//              longtext
//              numeric
//              noInput
//
// conditions (optional) - only shows the page if Xn equals Yn,
// eg a page with condition {'Vehicle': 'Bike', 'Brand': 'Honda'}
// would only be shown if the user had previously answered
// 'Bike' to the question titled 'Vehicle' and 'Honda'
// to the question titled 'Brand'. If the user did not respond
// with these specific answers, this page will not be displayed.
//

//An example of a simple text-page with no input, ie instructions or story-telling etc.
addPage("Welcome", "Your responses are autosaved to the folder with the server script as you go. Press next to continue", [], "noInput");

//An example of a simple one-choice-only input page. You can only choose one option
addPage("Vehicle", "What type of vehicle do you use?", ["Car", "Bike", "Plane"], "radiobuttons");

//An example of conditions. If the user selected "Car" as a response to the
//page titled "Vehicle", this page will show; otherwise it will not show.
//Also demonstrates freeform text input
conditions = {"Vehicle": "Car"};
addPage("Shape", "What shape is your car?", [], "shorttext", conditions);

//An example of a numeric input, which on mobile devices will display the number keyboard
conditions = {"Vehicle": "Plane"};
addPage("Engine Count", "How many engines does your plane have?", [], "numeric", conditions);

//An example of checkboxes
conditions = {"Vehicle": "Bike"};
addPage("Custom Parts", "What parts on your bike have been customised?", ["Exhaust", "Mirrors", "Lights", "Suspension"], "checkboxes", conditions);

//An example of seperating out the various elements of the page to make it easier to
//distinguish (in code) the different parts of the page rather than have them all on one line.
title = "Custom Parts";
options = ["Bodywork",  "Engine work", "Tinted windows", "Seats"];
explanation = "What parts of your car have been customised?";
conditions = {"Vehicle": "Car"};
addPage(title, explanation, options, "checkboxes", conditions);

//An example of a page using multiple conditions - this page is only shown if both Bike and Exhaust is selected
options = ["Akrapovic", "Yoshimura", "Termigoni", "Blue Devil", "Leo Vince", "Handmade"];
conditions = {"Vehicle": "Bike", "Custom Parts": "Exhaust"};
addPage("Exhaust Brand", "What brand is your custom bike exhaust?", options, "radiobuttons", conditions);

//An example of longer freeform text input
addPage("Notes", "Write some general notes on your vehicle", [], "longtext");

//The end page is shown automatically, you don't need to add it.
