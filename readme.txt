Web Questioner
v0.1
2011-12-26
Author: Ian Coleman

Web Questioner is a tool to create a series of questions, where
the next question displayed depends on the previous responses.

Quickstart:
    
1) run the command
python startServer.py

2) open a browser and navigate to
http://localhost:8000/index.html
Do NOT open the index.html file by double clicking it.

3) answer the demo questions to get a feel for the app.

4) see that there is a file created in the same folder as
startServer.py with an extension .json, which contains the
responses.

5) edit questions.js - This file contains comments to
assis with the process of creating the questions and
conditions for showing or not showing a page.







To change the style of the page, or the framework,
edit index.html

The .json filename format can be changed on line 359 of index.html
eg currently it saves the file as
'Username - Vehicle.json'
But if you were doing, say, wines you may want a filename like
'Username - Wine name - Vintage.json'
in which case you would set filenameIdentifiers to
["Wine name", "Vintage"]
where the title of the two relevant pages would be "Wine Name" and
"Vintage" and the filename would contain the responses to those
two questions.

report bugs by visiting the page at
https://github.com/thedawnrider/WebQuestioner