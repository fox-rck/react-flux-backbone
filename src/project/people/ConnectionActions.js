var constants = require('./constants');
var dispatch = require('project/shared/helpers/dispatch');


module.exports = {
    add: function(group) {
        Global.socket.emit("sync",{actionType:constants.CONNECTION_ADD, payload: group });
    },
    remove: function(group) {
        Global.socket.emit('sync',{actionType:constants.CONNECTION_REMOVE,payload:group});
    },
    get: function(page){
        Global.socket.emit('sync',{actionType:constants.CONNECTIONS_GET,payload:page});   
    },
    find: function(data){
        Global.socket.emit('sync',{actionType:constants.CONNECTIONS_FIND,payload:data});   
    }
};
