var constants = require('./constants');
var dispatch = require('project/shared/helpers/dispatch');


module.exports = {
    get: function(data){
        Global.socket.emit('sync',{actionType:constants.PROFILE_GET,payload:data});   
    }

};
