//var connect = require('connect');
//var serveStatic = require('serve-static');
//connect().use(serveStatic(__dirname)).listen(8085);


var express = require('express');
var path = require('path');
var port = process.env.PORT || 8085;
var app = express();

// serve static assets normally
app.use(express.static(__dirname));

// handle every other route with index.html, which will contain
// a script tag to your application's JavaScript file(s).
app.get('*', function (request, response) {
  response.sendFile(path.resolve(__dirname, 'react-snap', 'index.html'))
});

app.listen(port);
console.log("server started on port " + port);