const http = require('http');
const fs = require('fs');
global.DEBUG = true;

const server = http.createServer((request, response) => {
  if(DEBUG) console.log('Request Url:', request.url);
  let path = './views/';
  switch(request.url) {
    case '/':
      if(DEBUG) console.log('Root Route');
      path += 'index.html';
      if(DEBUG) console.log('Path:', path);
      fetchFile(path);
      break;
    case '/home':
      response.statusCode = 301;
      response.setHeader('Location', '/about');
      response.end();
      break;
    case '/cookie':
      response.setHeader('Set-Cookie', 'fullName=Fred Flinstone');
      response.end('Cookie Set');
      break;
    case '/about':
      if(DEBUG) console.log('About Route');    
      path += 'about.html';
      fetchFile(path);
      break;
    default:
      if(DEBUG) console.log('404 Not Found');
      response.writeHead(404, { 'Content-Type': 'text/plain' });
      response.end('404 Not Found');
      break;
  }
  function fetchFile(fileName) {
    fs.readFile(fileName, (error, content) => {
      if(error) {
        response.writeHead(500, { 'Content-Type': 'text/plain' });
        response.end('500 Internal Server Error');
      } else {
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(content, 'utf-8');
      }
    });
  };
});

server.listen(3000, () => {
  console.log('Server is running...');
});