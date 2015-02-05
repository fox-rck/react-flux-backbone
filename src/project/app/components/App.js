var React = require('react');
var Backbone = require('backbone');
var Header = require('./Header');
var Footer = require('./Footer');
var Notify = require('project/notify/components/Notify');
var Router = require('project/router/components/Router');
var dispatch = require('project/shared/helpers/dispatch');
var helpers = require('project/shared/helpers/helpers');
var Login = require('project/Login/Login');
var Register = require('project/app/components/Register');
var storeMixin = require('project/shared/helpers/storeMixin');
var AppStore = require('../AppStore');
var AppConstants = require('project/app/constants');
var SideBar = require('project/sideBar/SideBar');

// var LoginStore = require('project/Login/LoginStore');

Function.prototype.curry = function curry() {
    var fn = this, args = Array.prototype.slice.call(arguments);
    return function curryed() {
        return fn.apply(this, args.concat(Array.prototype.slice.call(arguments)));
    };
};


var xmlhttp;
if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp = new XMLHttpRequest();
} else {// code for IE6, IE5
    xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
}
function onReadystateChange(url,data)
{
console.log(url)
  if (xmlhttp.readyState==4 && xmlhttp.status==200)
    { 
        console.log(data);
        if(url.indexOf("/user") >= 0){
            var res = JSON.parse(data.target.response);
            Global.loggedInUser = res;
            join(res.UN);
            //var cnt = document.cookie.split("UN-").length;
            //console.log("found "+cnt+" UN cookies");
            //document.cookie="UN-1="+res.UN+";";
            var users = window.localStorage.getItem("Users")? JSON.parse(window.localStorage.getItem("Users")) : [];
            //console.log(users.isArray())
            users.push(res.UN);
            if(typeof(Storage) === "undefined") {
                alert("no storage")
            }
            window.localStorage.setItem("Users", JSON.stringify(users));
            window.location = "/";
        } else if (url.indexOf("/logoff") >= 0){
            window.location = "/";
        } else if (url.indexOf("/register") >= 0){
            window.location = "/";
        } else {
            //console.log("hit refresh get")
            // ONLY OTHER RESQUEST IS A GET TO REFRESH THE SOCKET SESSION
            //After a disconnect
            clearInterval(Global.intervalID);
            
        }
    }
}

var join = function (name) {

        // $('#ask').hide();
        // $('#channel').show();
        //$('input#message').focus();

        
        /*
         Connect to socket.io on the server.
         */
        var host = window.location.host.split(':')[0];
        Global.socket = io.connect('http://' + host, {reconnect:false, 'try multiple transports':false});
        Global.intervalID;
        Global.reconnectCount = 0;

        Global.socket.on('connect', function () {
            console.log('connected');
        });
        Global.socket.on('connecting', function () {
            console.log('connecting');
        });
        Global.socket.on('disconnect', function () {
            console.log('disconnect');
            Global.intervalID = setInterval(tryReconnect, 4000);
        });
        Global.socket.on('connect_failed', function () {
            console.log('connect_failed');
        });
        Global.socket.on('error', function (err) {
            console.log('error: ' + err);
        });
        Global.socket.on('reconnect_failed', function () {
            console.log('reconnect_failed');
        });
        Global.socket.on('reconnect', function () {
            console.log('reconnected ');
        });
        Global.socket.on('reconnecting', function () {
            console.log('reconnecting');
        });
        Global.socket.on('sync', function(data){
           // helpers.log(data);
            var res = JSON.parse(data);
            if(res.actionType){
                dispatch(res.actionType,res);
            }
        });
        Global.socket.on('message', function(actionType,data){
          //  helpers.log(data);
            var res = JSON.parse(data);
            // try{
            //     res = JSON.parse(data);
            // }
            if(res.actionType){
                dispatch(res.actionType,res);
            }
        });
        
         var tryReconnect = function () {
            ++Global.reconnectCount;
            if (Global.reconnectCount == 5) {
                clearInterval(Global.intervalID);
            }
            console.log('Making a dummy http call to set jsessionid (before we do socket.io reconnect)');
            var tmpxmlhttp = xmlhttp;
            xmlhttp.onreadystatechange = onReadystateChange.curry("/");
            tmpxmlhttp.open("GET","/",true);
            tmpxmlhttp.send();
        };
        Global.socket.emit('join', JSON.stringify({}));
    };

 
module.exports = React.createClass({
    mixins: [storeMixin(AppStore)],
    authenticate:function(data){
        helpers.log(data);
        xmlhttp.onreadystatechange = onReadystateChange.curry("/user");
        xmlhttp.open("POST","/user",true);
        xmlhttp.setRequestHeader("Content-type","application/json");
        xmlhttp.send(JSON.stringify(data));
    },
    register:function(data){
        helpers.log(data);
        xmlhttp.onreadystatechange = onReadystateChange.curry("/register");
        xmlhttp.open("POST","/register",true);
        xmlhttp.setRequestHeader("Content-type","application/json");
        xmlhttp.send(JSON.stringify(data));
    },
    logoff:function(data){
        // helpers.log("logoff");
        // Global.loggedInUser = null;
        var user = this.getUser();
        Global.loggedInUser = null;
        delete window.localStorage["Users"];
        //document.cookie="UN-1=null; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        Global.socket.send( {actionType:"LOGOFF", payload: user });
        xmlhttp.onreadystatechange = onReadystateChange.curry("/logoff");
        xmlhttp.open("POST","/logoff",true);

        xmlhttp.send();
    },
    renderLogin: function(){
        return this.state.users[0] != null?1:0;
    },
    setAuthentication:function(data){
         this.setState({ isAuthorized: data});
    },
    getUser:function(){
        //console.log(this.state.users[0]||"No Users");
        return this.state.users[0] || {};
    },
	componentDidMount: function() {
        var that = this;

        
        // if (document.cookie.indexOf("UN-") > -1){
        //     //cant check jsession cookie... 
        //     //rejoin using old session
        //     join();
        // }     
        
       if (window.localStorage){
        //cant check jsession cookie... 
        //rejoin using old session

            //if(JSON.parse(window.localStorage.getItem("Users")).length >= 0){
                join();
            //}
        }else {
            alert("no localStorage")
        }   
    },
    getInitialState: function() {
        return AppStore.getState();
    },
    getInitDataIfNeeded: function() {
        var meta = AppStore.getState();
        // if(props.activeEntity && props.activeEntity !== meta.id) {

        //     EntityActions.getEntityData(this.props.activeEntity);
        if(meta.todos === undefined){
            //no collection has been created...
            //events.get({p:1});
           // window.location = '/#login';
        }

    },
    toggleSideBar: function(){
        dispatch(AppConstants.TOGGLESIDEBAR,{})
    },
    toggleRegister: function(){
        dispatch(AppConstants.TOGGLEREGISTER,{})
    },
    isRegistering: function(){
        return this.state.isRegistering === true;
    },
    _onChange: function() {
        this.setState(AppStore.getState());
    },
    render: function() {
        var renderSideBar = this.renderLogin()? <SideBar /> :"";
        var Account = !this.isRegistering()?<Login ToggleRegister={this.toggleRegister} onAuth={this.authenticate} /> : <Register ToggleRegister={this.toggleRegister} Register={this.register} />
        var renderAuth = this.renderLogin()?  <div><Header logoff={this.logoff} getUser={this.state.users[0]} ToggleSideBar={this.toggleSideBar} /><Router /></div> : {Account};
        


        return <div>
        <div id="loading-app-mask">
            <div className="cont">
                <img src="images/logo.png" />
                <div className="spinner">
                  <div className="dot1"></div>
                  <div className="dot2"></div>
                </div>
            </div>
        </div>
            {renderSideBar}
            {renderAuth}
            <Footer />
        </div>;
    }
});
