// Edit this file to suit your own needs. You must include
// all five parts of the question - title, explanation, options,
// inputType and conditions.



// The filename which these responses are stored in will include
// one of the answers to the questions below. This makes
// it easier to identify that file.
var filenameIdentifiers = ["Filename Identifier"]; //this is the title of q2, so the
                                                   //response to q2 will be in the filename
q1 = {
    "title": "Welcome",
    "explanation": "Your responses are autosaved to the folder with the server script as you go. Press next to continue",
    "options": [],
    "inputType": "noInput",
    "conditions": alwaysAsk
}
addPage(q1);

q2 = {
    "title": "Filename Identifier",
    "explanation": "What word/phrase should be used in the filename for this particular set of responses?",
    "options": [],
    "inputType": "shorttext",
    "conditions": alwaysAsk
}
addPage(q2);

q3 = {
    "title": "Wine Label",
    "explanation": "Do You Know What The Wine You're Tasting Is?",
    "options": ["Yes", "No- Blind Tasting"],
    "inputType": "radiobuttons",
    "conditions": alwaysAsk
}
addPage(q3);

q4 = {
    "title": "Wine Label Information",
    "explanation": "What Country is the Wine from?",
    "options": ["France", "Spain", "Italy", "Australia", "New Zealand", "USA", "Argentina", "Chile", "Germany", "Other"],
    "inputType": "radiobuttons",
    "conditions": {"Wine Label": "Yes"}
}
addPage(q4);

q5 = {
    "title": "Appearance",
    "explanation": "How Do You Describe The Wines Clarity?",
    "options": ["Bright", "Dull", "Clear", "Hazy"],
    "inputType": "radiobuttons",
    "conditions": {"Wine Label": "No- Blind Tasting"}
}
addPage(q5);

q6 = {
    "title": "Intensity",
    "explanation": "Describing the Wines Intensity",
    "options": ["Pale", "Medium (-)", "Medium", "Medium (+)", "Deep"],
    "inputType": "radiobuttons",
    "conditions": alwaysAsk
}
addPage(q6);

q7 = {
    "title": "Colour",
    "explanation": "What is the Wines Colour",
    "options": ["White", "Rose", "Red"],
    "inputType": "radiobuttons",
    "conditions": alwaysAsk
}
addPage(q7);

q8 = {
    "title": "White Colour Detailed",
    "explanation": "Describe the colour in the glass?",
    "options": ["lemon-green", "lemon", "gold", "amber", "brown"],
    "inputType": "radiobuttons",
    "conditions": {"Colour": "White"}
}
addPage(q8);

q9 = {
    "title": "Mouth Feel",
    "explanation": "Describe the feeling in the mouth:",
    "options": ["Soft", "Dry", "Acidic", "Lumpy", "Cooling"],
    "inputType": "checkboxes",
    "conditions": alwaysAsk
}
addPage(q9);

q10 = {
    "title": "Closing Notes",
    "explanation": "Any final notes not covered yet?",
    "options": [],
    "inputType": "longtext",
    "conditions": alwaysAsk
}
addPage(q10);