#Modified from Jon Berg , turtlemeat.com

import cgi
import hashlib
import json
import os
import string
import sys
import time
from BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer

class MyHandler(BaseHTTPRequestHandler):

    def do_GET(self):
        try:
            if ((self.path.endswith(".html") or
                self.path.endswith(".css") or
                self.path.endswith(".js")) and
                self.path.find("..") == -1):
                f = open(os.getcwd() + os.sep + self.path)
                content = f.read()
                
                self.send_response(200)
                if self.path.endswith(".html"):
                    self.send_header('Content-type', 'text/html')
                    ip = self.client_address[0]
                    sessionId = hashlib.md5(ip + time.asctime()).hexdigest()[:10] #TODO consider if this is an adequate sessionId
                    sessionIdJsStr = "= '%s';" % sessionId
                    content = content.replace("= 0;/*sessionId*/", sessionIdJsStr)
                elif self.path.endswith(".css"):
                    self.send_header('Content-type', 'text/css')
                elif self.path.endswith(".js"):
                    self.send_header('Content-type', 'application/javascript')
                self.end_headers()
                self.wfile.write(content)
                f.close()
            return
                
        except IOError:
            self.send_error(404,'File Not Found: %s' % self.path)
     

    def do_POST(self):
        try:
            contentLength = int(self.headers.get("Content-length", None))
            content = self.rfile.read(contentLength);
            clientData = json.loads(content)
            fname = clientData['filename']
            if fname.find("..") == -1 and fname.find("/") == -1: #TODO improve this very basic validation
                self.write_question_response_to_file(clientData)
            else:
                print "Invalid filename, do not use .. or / in it - %s" % fname
                self.send_error(400, "Invalid filename, do not use .. or / in it")
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"success": True}))
        except:
            print sys.exc_info()
            self.send_error(400, "Unknown error")
        return

    def write_question_response_to_file(self, clientData):
        root = os.getcwd()
        files = os.listdir(root) #TODO can be more efficient than iteration I'm sure
        for existingFilename in files:
            if(existingFilename.find(clientData['sessionId']) != -1):
                toRemove = os.path.join(root, existingFilename)
                os.remove(toRemove)
        f = open(clientData['filename'], 'w')
        f.write(json.dumps(clientData['jsonData']))
        f.close()
        #TODO also make a nice 'report' webpage from jsonData using the same filename but with .html extension

     

def main():
    try:
        PORT = 8000
        server = HTTPServer(('', PORT), MyHandler)
        print 'started httpserver at http://localhost:%i...' % PORT
        server.serve_forever()
    except KeyboardInterrupt:
        print '^C received, shutting down server'
        server.socket.close()

if __name__ == '__main__':
    main()
    #TODO launch the browser to "http://localhost:8000/index.html"
