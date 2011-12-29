#Copyright Jon Berg , turtlemeat.com

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
                    sessionId = "= '%s';" % hashlib.md5(ip + time.asctime()).hexdigest() #TODO consider if this is an adequate sessionId
                    content = content.replace("= 0;/*sessionId*/", sessionId)
                elif self.path.endswith(".css"):
                    self.send_header('Content-type', 'text/css')
                elif self.path.endswith(".js"):
                    self.send_header('Content-type', 'application/javascript')
                self.end_headers()
                self.wfile.write(content)
                f.close()
                return
                
            return
                
        except IOError:
            self.send_error(404,'File Not Found: %s' % self.path)
     

    def do_POST(self):
        try:
            contentLength = int(self.headers.get("Content-length", None))
            content = self.rfile.read(contentLength);
            clientData = json.loads(content)
            fname = clientData['filename']
            if fname.find("..") == -1 and fname.find("/") == -1:
                root = os.getcwd()
                files = os.listdir(root)
                for existingFilename in files:
                    if(existingFilename.find(clientData['sessionId']) != -1):
                        toRemove = os.path.join(root, existingFilename)
                        os.remove(toRemove)
                f = open(fname, 'w')
                f.write(json.dumps(clientData['jsonData']))
                f.close()
                #TODO also make a sexy webpage from jsonData using the same filename but with .html extension
            else:
                print "Invalid filename, do not use .. or / in it"
                #TODO return an error so the user can deal with it
        except:
            print sys.exc_info()

     

def main():
    try:
        server = HTTPServer(('', 8000), MyHandler)
        print 'started httpserver...'
        server.serve_forever()
    except KeyboardInterrupt:
        print '^C received, shutting down server'
        server.socket.close()

if __name__ == '__main__':
    main()
    #TODO launch the browser to "http://localhost:8000/index.html"
