//This is where the questions and the logic of what questions to ask
//is set.
//
//The order that the questions as written here is the order they will be
//displayed.
//
//Use the 'conditions' parameter for each page to say whether
//that page should be displayed or not based on previous responses.
//
//
// The parameters to be set for each question is:
//
// title - eg "Vehicle" - NOTE: title must be unique,
//         don't have 'Colour' as the title for the page of,
//         say, the colour of a car, and 'Colour' later
//         as the title of, say, the colour of the car interior.
//         Instead use 'Car Colour' and 'Interior Colour' as
//         the titles.
//
// explanation - this explains what the user is responding to
//               eg "What type of vehicle do you use".
//
// options - eg ["Car", "Bike", "Plane"] - for freeform text input
//           use [], ie no options
//
// input type - eg "radiobuttons", select from
//              radiobuttons
//              checkboxes
//              shorttext
//              longtext
//              numeric
//              noInput
//
// conditions (optional) - only shows the page if KeyN equals ValN,
// eg a page with condition {'Vehicle': 'Bike', 'Brand': 'Honda'}
// would only be shown if the user had previously answered
// 'Bike' to the question titled 'Vehicle' and 'Honda'
// to the question titled 'Brand'. If the user did not respond
// with these specific answers, this page will not be displayed.
// Use alwaysAsk if this question should always be displayed.


var filenameIdentifiers = ["Vehicle"]; //The values of responses to include in the filename

title = "Welcome";
explanation = "Your responses are autosaved to the folder with the server script as you go. Press next to continue";
options = [];
inputType = "noInput";
conditions = alwaysAsk;
addPage(title, explanation, options, inputType, conditions);

title = "Vehicle";
explanation = "What type of vehicle do you use?";
options = ["Car", "Bike", "Plane"];
inputType = "radiobuttons";
conditions = alwaysAsk;
addPage(title, explanation, options, inputType, conditions);

title = "Shape";
explanation = "What shape is your car?";
options = [];
inputType = "shorttext";
conditions = {"Vehicle": "Car"};
addPage(title, explanation, options, inputType, conditions);

title = "Engine Count";
explanation = "How many engines does your plane have?";
options = [];
inputType = "numeric";
conditions = {"Vehicle": "Plane"};
addPage(title, explanation, options, inputType, conditions);

title = "Custom Parts";
explanation = "What parts on your bike have been customised?";
options = ["Exhaust", "Mirrors", "Lights", "Suspension"];
inputType = "checkboxes";
conditions = {"Vehicle": "Bike"};
addPage(title, explanation, options, inputType, conditions);

title = "Custom Parts";
options = ["Bodywork",  "Engine work", "Tinted windows", "Seats"];
explanation = "What parts of your car have been customised?";
inputType = "checkboxes";
conditions = {"Vehicle": "Car"};
addPage(title, explanation, options, inputType, conditions);

title = "Exhaust Brand";
explanation = "What brand is your custom bike exhaust?";
options = ["Akrapovic", "Yoshimura", "Termigoni", "Blue Devil", "Leo Vince", "Handmade"];
inputType = "radiobuttons";
conditions = {"Vehicle": "Bike", "Custom Parts": "Exhaust"}; //Both conditions must be met
addPage(title, explanation, options, inputType, conditions);

title = "Notes";
explanation = "Write some general notes on your vehicle";
options = [];
inputType = "longtext";
conditions = alwaysAsk;
addPage(title, explanation, options, inputType, conditions);

//The end page is shown automatically, you don't need to add it.