#Copyright Jon Berg , turtlemeat.com

import cgi,json,string,sys,time
from os import curdir, sep
from BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer

class MyHandler(BaseHTTPRequestHandler):

    def do_GET(self):
        try:
            if ((self.path.endswith(".html")or
                self.path.endswith(".css") or
                self.path.endswith(".js")) and
                self.path.find("..") == -1):
                f = open(curdir + sep + self.path)

                self.send_response(200)
                self.send_header('Content-type',    'text/html')
                self.end_headers()
                self.wfile.write(f.read())
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
            if fname.find("..") == -1:
                f = open(fname, 'w')
                f.write(json.dumps(clientData['jsonData']))
                f.close()
                #TODO also make a sexy webpage from jsonData using the same filename but with .html extension
            else:
                print "Invalid filename, do not use .. in it"
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
