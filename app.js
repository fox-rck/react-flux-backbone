var express = require('express')
    , router = express.Router()
    , http = require('http')
    , path = require('path')
    , redis = require('redis')
    , methodOverride = require('method-override')
    , cookieParser = require('cookie-parser')
    , bodyParser = require('body-parser')
    , compression = require('compression')
    , expressSession = require('express-session')
    , serveStatic = require('serve-static')
    , _ = require('underscore')
    , todo_data = require('./src/server/dataStore')
    , manageBlerp = require('./src/server/blerps')
    , manageUsers = require('./src/server/user')
    , manageGroups = require('./src/server/groups')
    , managePeople = require('./src/server/people');
/*
 Setup Express & Socket.io
 */
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);


//Set xhr-polling as WebSocket is not supported by CF
//io.set("transports", ["xhr-polling"]);

//Set Socket.io's log level to 1 (info). Default is 3 (debugging)
//io.set('log level', 1);





//TODO: remove block below once included datastore is verified

// var todo_data =[
//   {
//     user_id:1
//     , todos: [ ]
//   }
// ];
// 




/*
 Also use Redis for Session Store. Redis will keep all Express sessions in it.
 */
var session = require('express-session'), 
    RedisStore = require('connect-redis')(session),
    rClient = redis.createClient(),
    sessionStore = new RedisStore({client:rClient});

//var MemoryStore = express.session.MemoryStore;
//
//var sessionStore = new MemoryStore();

var cookieParser = cookieParser('your secret here');
/*
* TODO: Get to run on differnt ports.. might need a nginx proxy
*/
// all environments
app.set('title', 'blerpiT v2.0');
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
//app.use(express.favicon());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(compression());

app.use(serveStatic('./build', {'index': ['index.html', 'index.htm']}));
app.use(serveStatic('./public', {'index': null}));
//serveStatic('./public', {'index': null});
//app.use(serveIndex('./build'));
/*
 Use cookieParser and session middlewares together.
 By default Express/Connect app creates a cookie by name 'connect.sid'.But to scale Socket.io app,
 make sure to use cookie name 'jsessionid' (instead of connect.sid) use Cloud Foundry's 'Sticky Session' feature.
 W/o this, Socket.io won't work if you have more than 1 instance.
 If you are NOT running on Cloud Foundry, having cookie name 'jsessionid' doesn't hurt - it's just a cookie name.
 */
app.use(cookieParser);
app.use(expressSession({store:sessionStore
    , key:'jsessionid'
    , secret:'your secret here'
    , saveUninitialized: false // don't create session until something stored,
    , resave: false // don't save session if unmodified}));
}));
    // app.use(app.router);
    // app.use(express.static(path.join(__dirname, 'public')));
// development only
if ('development' == app.get('env')) {
 // app.set('db uri', 'localhost/dev');
    //app.use(express.errorHandler());
}

// production only
if ('production' == app.get('env')) {
 // app.set('db uri', 'n.n.n.n/prod');
}
// router.route('/post/:slug')
//   .all(function(req, res, next) {
//     // runs each time
//     // we can fetch the post by id from the database
//   })
//   .get(function(req, res, next) {
//     //render post
//   })
//   .put(function(req, res, next) {
//     //update post
//   })
//   .post(function(req, res, next) {
//     //create new comment 
//   })
//   .delete(function(req, res, next) {
//     //remove post
//   });
//app.get('/', routes.index);

app.post('/logoff', function (req, res) {
    req.session.destroy();
    res.end();
});

/*
 When the user logs in (in our case, does http POST w/ user name), store it
 in Express session (which inturn is stored in Redis)
 */
app.post('/user', function (req, res) {
    manageUsers.login(req.body.EM,req.body.PW).then(function(user){
      console.log(user);
        req.session.user = user;
        // res.body(userName);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(user, null, 2))
    });
});

app.post('/register', function (req, res) {
   var new_user = {
            FN: req.body.FN,
            LN: req.body.LN,
            EM: req.body.EM,
            BD: req.body.BD,
            UI: "/images/1508022_10101692114196709_1177587236593533018_n.jpg",
            PW: req.body.PW,
            JD: new Date()
        }
    console.log(new_user);
    manageUsers.add(new_user).then(function(user){
      req.session.user = user;
      // res.body(userName);
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(user, null, 2))
    });
});
/*
 Use SessionSockets so that we can exchange (set/get) user data b/w sockets and http sessions
 Pass 'jsessionid' (custom) cookie name that we are using to make use of Sticky sessions.
 */
var SessionSockets = require('session.socket.io');
var sessionSockets = new SessionSockets(io, sessionStore, cookieParser, 'jsessionid');


/*
 Create two redis connections. A 'pub' for publishing and a 'sub' for subscribing.
 Subscribe 'sub' connection to 'chat' channel.
 */
var sub = redis.createClient();
var pub = redis.createClient();
sub.subscribe('sync');

sessionSockets.on('connection', function (err, socket, session) {
     console.log("connection")
     if(!session || !session.user) return;
    /*
     When a user joins the channel, publish it to everyone (including myself) using
     Redis' 'pub' client we created earlier.
     Notice that we are getting user's name from session.
     */
    socket.on('join', function () {
        console.log("join: "+session.user)
        var userReply = JSON.stringify({ actionType: 'AUTHENTICATED', payload: session.user});
        socket.send('sync', userReply);
        // var globalReply = JSON.stringify({ actionType: '', payload: data.payload });
        // socket.send('sync', userReply);
    });

    socket.on('sync', function (data) {
        console.log(data);
        switch (data.actionType) {
          case "TODO_ADD" :
            //TODO: call manageblerp Object and call add
            manageBlerp.add(data,session).then(function(new_todo){
                var reply = JSON.stringify({ actionType: data.actionType, payload: new_todo });
                pub.publish('sync', reply);
            });
            
          break;
          case "TODOS_GET" :
            //TODO: pass in dynamic page number
            manageBlerp.get(1,session).then(function(blerps){
                var reply = JSON.stringify({ actionType: data.actionType, payload: blerps });
                socket.send('sync', reply);
            });
          break;
          case "TODOS_GETBYGROUPID" :
            //TODO: pass in dynamic page number
            manageBlerp.getByGroupId(data.payload._id,data.payload.filters||[],session).then(function(blerps){
                var reply = JSON.stringify({ actionType: data.actionType, payload: blerps });
                socket.send('sync', reply);
            });
          break; 
          case "TODOS_GETBYID" :
            //TODO: pass in dynamic page number
            manageBlerp.getByIds(data.payload,session).then(function(blerps){
                var reply = JSON.stringify({ actionType: data.actionType, payload: blerps });
                socket.send('sync', reply);
            });
          break;
          case "TODO_TOGGLE" :
            manageBlerp.toggleComplete(data,session).then(function(todo){
                //console.log("replying: "+todo)
                var reply = JSON.stringify({ actionType: data.actionType, payload: data.payload });
                pub.publish('sync', reply);
            });
          break;
          case "TODO_REMOVE" :
            var todo = manageBlerp.remove(data,session);
            var reply = JSON.stringify({ actionType: data.actionType, payload: todo });
            pub.publish('sync', reply);
          break;
          case "GROUPS_GET" :
            //TODO: pass in dynamic page number
            manageGroups.get(data,session,socket);
          break;
          case "GROUP_ADD" :
            //TODO: pass in dynamic page number
            manageGroups.add(data,session,socket);
          break; 
          case "GROUP_UPDATE" :
            //TODO: pass in dynamic page number
            manageGroups.update(data,session,pub);
          break; 
          case "CONNECTIONS_FIND" :
            //TODO: pass in dynamic page number
            manageUsers.find(data,session,socket);
          break;
          case "CONNECTION_ADD" :
            //TODO: pass in dynamic page number
            managePeople.add(data,session,socket);
          break;
          case "CONNECTIONS_GET" :
            //TODO: pass in dynamic page number
            managePeople.get(data,session,socket);
          break;
          case "FEED_GETUSERS" :
            manageUsers.getUsers(data.payload).then(function(users){
              var reply = JSON.stringify({ actionType: data.actionType, payload: users });
              socket.send('sync', reply);
            });
          break;
          case "BLERPBYID" :
          //TODO: pass in dynamic page number
            manageBlerp.getById(data,session,socket);
          break;
          case "BLEERPSHAREDFEEDS" :
            manageBlerp.getShares(data,session,socket);
          break;
          case "GETCOMMENTS" :
            manageBlerp.getComments(data,session,socket);
          break;
          case "ADDCOMMENT" :
            manageBlerp.addComment(data,session,pub);
          break;
          case "PROFILE_GET" :
            manageUsers.getById(data,session,socket);
          break;
          default :
            var reply = JSON.stringify({ actionType: data.actionType, payload: data.payload });
            pub.publish('sync', reply);
        }
    });

    /*
     Use Redis' 'sub' (subscriber) client to listen to any message from Redis to server.
     When a message arrives, send it back to browser using socket.io
     */
    sub.on('message', function (channel, message) {
        socket.emit(channel, message);
    });
});

server.listen(process.env.PORT || 3000, function () {
    var serverName = process.env.VCAP_APP_HOST ? process.env.VCAP_APP_HOST + ":" +(process.env.PORT || 3000) : '127.0.0.1:'+(process.env.PORT || 3000);
    console.log("Express server listening on " + serverName);
});
