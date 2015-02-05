'use strict';
var constants = require('./constants');
module.exports = {
	getFeedUsers: function(data){
        Global.socket.emit('sync',{actionType:constants.FEED_GETUSERS,payload:data});   
    }
}
