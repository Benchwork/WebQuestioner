Web Questioner
v0.1
2011-12-26
Author: Ian Coleman

Web Questioner is a tool to create a series of questions, where
the next question displayed depends on the previous responses.

Quickstart:
    
1) run the command
python startServer.py

2) open a browser and type in the address bar
http://localhost:8000/index.html
Do NOT open the page by double clicking index.html in the file explorer.

3) answer the demo questions to get a feel for the app. Note that there
is a .json file saved in the same folder as questions.js which contains
the responses to the questions.

4) Edit questions.js







To change the style of the page, or the framework,
edit index.html



There are a few different input types available:

shorttext - freeform text around 20 characters max. In practice it's not
actually limited, but it's a bit cumbersome to edit lots of text in this
input type.

radiobuttons - a list of predefined options where only one can be chosen.

numeric - like shorttext but for numbers. No checking is done, so the
user can still enter non-numeric input, but on mobile devices this will
show the number keyboard by default rather than the text keyboard.

checkboxes - a list of predefined options where multiple options may be
valid.

longtext - like shorttext but allows for more input to be shown on the
screen.

noInput - if there's no input (eg instructions or story-telling) this
is the input type to use.




report bugs by visiting the page at
https://github.com/thedawnrider/WebQuestioner