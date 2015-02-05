var constants = require('./constants');
var dispatch = require('project/shared/helpers/dispatch');


module.exports = {
    add: function(group) {
        Global.socket.emit("sync",{actionType:constants.GROUP_ADD, payload: group });
    },
    remove: function(group) {
        Global.socket.emit('sync',{actionType:constants.GROUP_REMOVE,payload:group});
    },
    get: function(page){
        Global.socket.emit('sync',{actionType:constants.GROUPS_GET,payload:page});   
    },
    update: function(page){
        Global.socket.emit('sync',{actionType:constants.GROUP_UPDATE,payload:page});   
    }
};
