const http = require('http');
const fs = require('fs');
global.DEBUG = false;

const server = http.createServer((request, response) => {
  if(DEBUG) console.log('Request Url:', request.url);
  let filename = 'index.html';
  switch(request.url) {
    case '/':
      if(DEBUG) console.log('Root Route');
      filename = 'index.html';
      fetchFile(filename);
      break;
    case '/home':
      if(DEBUG) console.log('Home Route');
      filename = 'home.html';
      fetchFile(filename);
      break;
    case '/about':
      if(DEBUG) console.log('About Route');    
      filename = 'about.html';
      fetchFile(filename);
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