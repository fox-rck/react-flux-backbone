var fs = require('fs');
var express = require('express');
var responseTime = require('response-time');
var serveStatic = require('serve-static');
var serveIndex = require('serve-index');
var compression = require('compression');


var app = express();

app.use(compression());
app.use(serveStatic('./build'));
app.use(serveStatic('./public'));
app.use(serveIndex('./build'));
app.use(responseTime());


var server = app.listen(process.env.PORT || 3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

app.get('/authenticate', function(req, res){
	console.log(req)
 // res.send('hello world');
});