// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
const port =  process.env.port || 3000;
// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// set up a route to redirect http to https
app.all('*', function(request, response, next){
  if(request.get('X-Forwarded-Proto').indexOf('https') === -1) {
    return next();
  } else {
    response.redirect('https://' + request.hostname + request.url);
  }
});

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(request, response) {
  response.sendFile(__dirname + "/public/views/index.html");
});

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// listen for requests :)
var listener = app.listen(port, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});