const http = require('http');
const fs = require('fs');
const path = require('path');

const EventEmitter = require('events');
class MyEmitter extends EventEmitter {}
const myEmitter = new EventEmitter(); 

const routes = require('./routes.js');

global.DEBUG = true;

myEmitter.on('route', (url) => {
  const d = new Date();
  if(DEBUG) console.log(`Route Event on: ${url} at ${d}`);
  if(!fs.existsSync(path.join(__dirname, 'logs'))) {
    fs.mkdirSync(path.join(__dirname, 'logs'));
  }
  fs.appendFile(path.join(__dirname, 'logs', 'route.log'), `Route Event on: ${url} at ${d}\n`, (error) => {
    if(error) throw error;
  });
});

const server = http.createServer((request, response) => {
  if(DEBUG) console.log('Request Url:', request.url);
  let path = './views/';
  switch(request.url) {
    case '/':
      path += 'index.html';
      myEmitter.emit('route', path);
      routes.indexPage(path, response);
      break;
    case '/home':
      path += 'home.html';
      myEmitter.emit('route', path);
      routes.homePage(path, response);
      break;
    case '/about-me':
      response.statusCode = 301;
      response.setHeader('Location', '/about');
      response.end();
      break;
    case '/cookie':
      response.setHeader('Set-Cookie', 'fullName=Fred Flinstone');
      response.end('Cookie Set');
      break;
    case '/about':
      path += 'about.html';
      myEmitter.emit('route', path);
      routes.aboutPage(path, response);
      break;
    default:
      if(DEBUG) console.log('404 Not Found');
      response.writeHead(404, { 'Content-Type': 'text/plain' });
      response.end('404 Not Found');
      break;
  }
});

server.listen(3000, () => {
  console.log('Server is running...');
});