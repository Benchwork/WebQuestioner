#Modified from Jon Berg , turtlemeat.com

import Cookie
import cgi
import hashlib
import json
import os
import string
import sys
import time
import urllib2
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
                    session_id = hashlib.md5(ip + time.asctime()).hexdigest()[:10]
                    c = Cookie.SimpleCookie()
                    c['session_id'] = session_id
                    self.send_header('Set-Cookie', c.output(header=''))
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
            if(self.path == "/save"):
                self.save_response()
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"success": True}))
        except:
            print sys.exc_info()
            self.send_error(400, "Unknown error")
        return

    def save_response(self):
        contentLength = int(self.headers.get("Content-length", None))
        content = self.rfile.read(contentLength);
        clientData = json.loads(content)
        c = Cookie.SimpleCookie(self.headers["Cookie"])
        username = "Unknown user"
        if("username" in c):
            username = urllib2.unquote(c["username"].value)
        session_id = c["session_id"].value
        fname = username + "_" + session_id + ".json"
        if fname.find("..") == -1 and fname.find("/") == -1: #TODO improve this very basic validation
            self.write_question_response_to_file(fname, clientData)
        else:
            print "Invalid filename, do not use .. or / in it - %s" % fname
            self.send_error(400, "Invalid filename, do not use .. or / in it")
        
    def write_question_response_to_file(self, file_name, clientData):
        root = os.getcwd()
        file_location = os.path.join(root, file_name)
        content = {}
        if os.path.exists(file_location):
            f = open(file_location)
            content = json.loads(f.read())
            f.close()
        for a in clientData["add"]:
            content[a["title"]] = a["response"]
        for r in clientData["remove"]:
            if r in content:
                del content[r]
        f = open(file_location, 'w')
        f.write(json.dumps(content))
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
