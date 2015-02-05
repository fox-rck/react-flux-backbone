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

/*

require('node-jsx').install();
var App = require('./project/app/components/App.js');
var indexHtml = fs.readFileSync(__dirname + '/index.html', 'utf8');


*/
// app.get('/api/todos', function(req, res) {
//   //  var rendered = React.renderComponentToString(App());
//     res.send([{name:"item 1"},{name :"item 2"}]);
// });
// var server = app.listen(3000, function () {
//   var host = server.address().address;
//   var port = server.address().port;

//   console.log('Example app listening at http://%s:%s', host, port);
// });


var server = require('http').createServer();
var io = require('socket.io')(server);
io.on('connection', function(socket){
	console.log("socket listening to client id:" + socket.id)
  // socket.on('event', function(data){
  //   console.log(data);
  // });
  socket.on('message', function(data){
    console.log("message from client id:" + socket.id)
    switch (data.actionType){
       case "AUTHENTICATE":
       var User;
        if(data.payload.UN == "Rick"){
            User = {
              UN:"RFox",
              UI:"/images/10394837_10204618859978015_7256389402107030154_n.jpg",
            };
            socket.emit("AUTHENTICATED",User)
        }else{
           socket.send("AUTHENTICATED");
        }
      break;
      case "LOGOFF":
        data.payload = false;
        socket.send("UN-AUTHENTICATED");
      break;
      default:
        // io.sockets.connected[socket.id].emit(data);
        socket.send(data);
      break;
    }
  });
  socket.on('disconnect', function(){
  	console.log("socket disconnecting")
  });

});
server.listen(5000,function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example Socket listening at http://%s:%s', host, port);
});