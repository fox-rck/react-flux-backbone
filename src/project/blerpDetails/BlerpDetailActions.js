'use strict';
var constants = require('./constants');
var dispatch = require('project/shared/helpers/dispatch');


module.exports = {
    getById: function(data){
        Global.socket.emit('sync',{actionType:constants.BLERPBYID,payload:data});   
    },
    getFoundIn: function(data) {
    	console.log(data)
        Global.socket.emit('sync',{actionType:constants.BLEERPSHAREDFEEDS,payload:data});   
    },
    toggle: function(todo) {
        todo.complete = !todo.complete;
        Global.socket.emit('sync',{actionType:constants.TODO_TOGGLE,payload:todo});
    },
    getComments: function(data) {
    	console.log(data)
        Global.socket.emit('sync',{actionType:constants.GETCOMMENTS,payload:data});
    },
    addComment: function(data) {
    	console.log(data)
        Global.socket.emit('sync',{actionType:constants.ADDCOMMENT,payload:data});
    }
};
