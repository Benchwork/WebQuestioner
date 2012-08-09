// Edit this file to suit your own needs.

// How to use conditions:
//
// conditions have the form
// {title1: value1, title2: value2a, title2: value2b} etc
//
// Only one condition must be met for the question to be displayed.
// eg if value1 is selected from question title1, or if value2a or value2b
// from question title2 is selected, the question will be displayed. If
// none of these values are found, the question will not be displayed.

var quiz = new Quiz();

quiz.add_question(
    new Instruction()
    .title("Welcome")
    .explanation("Your responses are autosaved to the folder with the server script as you go. Press next to continue"));

quiz.add_question(
    new NumericQuestion()
    .title("Vintage")
    .explanation("Which year was this wine produced?"));

quiz.add_question(
    new RadiobuttonsQuestion()
    .title("Wine Label")
    .explanation("Do You Know What The Wine You're Tasting Is?")
    .options(["Yes", "No - Blind Tasting"]));

quiz.add_question(
    new RadiobuttonsQuestion()
    .title("Wine Label Information")
    .explanation("What Country is the Wine from?")
    .options(["France", "Spain", "Italy", "Australia", "New Zealand", "USA", "Argentina", "Chile", "Germany", "Other"])
    .conditions({"Wine Label": "Yes"}));

quiz.add_question(
    new RadiobuttonsQuestion()
    .title("Appearance")
    .explanation("How Do You Describe The Wines Clarity?")
    .options(["Bright", "Dull", "Clear", "Hazy"])
    .conditions({"Wine Label": "No - Blind Tasting"}));

quiz.add_question(
    new RadiobuttonsQuestion()
    .title("Intensity")
    .explanation("Describing the Wines Intensity")
    .options(["Pale", "Medium (-)", "Medium", "Medium (+)", "Deep"]));

quiz.add_question(
    new RadiobuttonsQuestion()
    .title("Colour")
    .explanation("What is the Wines Colour")
    .options(["White", "Rose", "Red"]));

quiz.add_question(
    new RadiobuttonsQuestion()
    .title("White Colour Detailed")
    .explanation("Describe the colour in the glass")
    .options(["lemon-green", "lemon", "gold", "amber", "brown"])
    .conditions({"Colour": "White"}));

quiz.add_question(
    new CheckboxesQuestion()
    .title("Mouth Feel")
    .explanation("Describe the feeling in the mouth:")
    .options(["Soft", "Dry", "Acidic", "Lumpy", "Cooling"]));

quiz.add_question(
    new LongtextQuestion()
    .title("Closing Notes")
    .explanation("Any final notes not covered yet?"));