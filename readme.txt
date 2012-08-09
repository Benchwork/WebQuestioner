Web Questioner
v0.1.2
2012-08-09
Author: Ian Coleman

Web Questioner is a web-based questionnaire, originally created as
a simple but flexible way to record notes from wine-tasting. The goals
are to:
- Make it easy to build custom questionaires
- Make the next question asked vary depending on the previous responses
- Save the responses in a useful format for any potential future use

Quickstart:
    
1) run the command
python startServer.py

2) open a browser and type in the address bar
http://localhost:8000/index.html
Do NOT open the page by double clicking index.html in the file explorer.

3) answer the demo questions to get a feel for the app. Note that there
is a .json file saved in the same folder as questions.js which contains
your responses to the questions.

4) Edit questions.js to suit your needs






There are a few different input types available:

Shorttext - freeform text around 20 characters max. In practice it's not
actually limited, but it's a bit cumbersome to edit lots of text in this
input type.

Longtext - like shorttext but allows for more input to be shown on the
screen.

Numeric - like shorttext but for numbers. No checking is done, so the
user can still enter non-numeric input, but on mobile devices this will
show the number keyboard by default rather than the text keyboard.

Radiobuttons - a list of predefined options where only one can be chosen.

Checkboxes - a list of predefined options where multiple options may be
valid.

Instruction - if there's no input (eg instructions or story-telling) this
is the input type to use.





Because this is a web-based tool it can be used concurrently by
many people. This was desirable in the original wine-tasting
context, as wine-tasting often happens in groups, so all
members of the group can use their phone/tablet to make their own
notes at the same time. This led to the need to distinguish
between each others notes, and thus the questioner stores the
name of each user in the filename to help identify the response files
they generate.


