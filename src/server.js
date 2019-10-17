const http = require('http');
const fs = require('fs');
const path = require('path');
const {cities} = require('./cities.js');
const weatherIn = require('./getweather.js');
const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 4000;
const publicDirPath = path.join(path.resolve(__dirname),'../public');

let notFoundHandler = (req,res)=>{
  // console.log(req)
  fs.readFile(path.join(__dirname, '../public/page-not-found.html'), 'utf8', (err, file) => {
    /* istanbul ignore if */
    if (err) {
      res.writeHead(500, {'content-type': 'text/plain'});
      res.end('server error');
    } else {
      res.writeHead(404, {'content-type': 'text/html'});
      res.end(file);
    }
  });
};
let handlePublicFile = (filePath,contentTypeObj,req,res)=>{
  return (req,res)=>{
    fs.readFile(path.join(__dirname,'../public' ,filePath), (err, file) => {
      /* istanbul ignore if */
      if (err) {
        if(err.code=='ENOENT'){
          notFoundHandler(req,res);return;
        }
        res.writeHead(500, {'content-type': 'text/plain'});
        res.end('server error');
      } else {
        res.writeHead(200, contentTypeObj);
        res.end(file);
      }
    });
  };
}

let handlePublicTextFile = (filePath,contentTypeObj,req,res)=>{
  return (req,res)=>{
    fs.readFile(path.join(__dirname,'../public' ,filePath), 'utf-8', (err, file) => {
      /* istanbul ignore if */
      if (err) {
        res.writeHead(500, {'content-type': 'text/plain'});
        res.end('server error');
      } else {
        res.writeHead(200, contentTypeObj);
        res.end(file);
      }
    });
  };
}



const handler = (req, res) => {
  const url = req.url;

  console.log('URL: ', url);

  if (url === '/') {
    fs.readFile(path.join(__dirname, '../public/index.html'), 'utf8', (err, file) => {
      /* istanbul ignore if */
      if (err) {
        res.writeHead(500, {'content-type': 'text/plain'});
        res.end('server error');
      } else {
        res.writeHead(200, {'content-type': 'text/html'});
        res.end(file);
      }
    });
  } else if (url === '/getcountries') {
        res.writeHead(200, {'content-type': 'text/json'});
        res.end(cities);

  } else if (url === '/getweather') {
    weatherIn(req,res);
  } else if (url === '/css/stylesheet.css'||path.extname(url)=='.css') {
    handlePublicFile(url, {'content-type': 'text/css'},req,res)(req,res);

  } else if (url === '/js/request.js') {
    fs.readFile(path.join(__dirname, 'request.js'), 'utf8', (err, file) => {
      /* istanbul ignore if */
      if (err) {
        res.writeHead(500, {'content-type': 'text/plain'});
        res.end('server error');
      } else {
        res.writeHead(200, {'content-type': 'text/javascript'});
        res.end(file);
      }
    });
  } else if (url === '/js/index.js'||path.extname(url)=='.js') {
    handlePublicFile(url,{'content-type': 'text/javascript'},req,res)(req,res);

  } else if (path.extname(url)=='.html') {
    handlePublicFile(url,{'content-type': 'text/html'},req,res)(req,res);

  } else if (url === '/images/404-page.png' || path.extname(url)=='.jpg' ||path.extname(url)=='.png'||path.extname(url)=='.gif') {
    handlePublicFile(url, {'content-type': 'image/png'},req,res)(req,res);
    // res.writeHead(200, {'content-type': 'application/json'});
    // res.end(JSON.stringify(repos.fac));//keep an eye on this it'll help later, do some GREP magic
  } else if (url === '/api/repos/dwyl') {
    res.writeHead(200, {'content-type': 'application/json'});
    res.end(JSON.stringify(repos.dwyl));
  } else {
    res.writeHead(404, {'content-type': 'text/html'});
    notFoundHandler(req,res);return;
  }
}

const server = http.createServer(handler);

server.listen(port);

console.log('server running on: http://' + host + ':' + port);

module.exports = {
  server: server,
  handler: handler
}
