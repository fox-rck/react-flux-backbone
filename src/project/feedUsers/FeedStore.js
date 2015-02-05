
var AppDispatcher = require('project/shared/dispatcher');
var EventEmitter = require('events').EventEmitter;
var constants = require('./constants');
var _ = require('underscore');

var _state = {
    // your state container where 
    users:[]
};


var FeedUserStore = _.extend({}, EventEmitter.prototype, {
    // Return State
    getState: function() {
        return _state;
    },
    addUser: function (user){
        _state.users.push(user);
    },
    getUser: function (id){
        var ret;
        _.each(_state.users,function(user) {
            ret = user;
        });
        return ret;
    },
    // Emit Change event
    emitChange: function() {
        this.emit('change');
    },
    // Add change listener
    addChangeListener: function(callback) {
        this.on('change', callback);
    },
    // Remove change listener
    removeChangeListener: function(callback) {
        this.removeListener('change', callback);
    },
    resetState: function(){
        _state.users = [];
    }
});

FeedUserStore.appDispatch = AppDispatcher.register(function(payload) {
    var action = payload.actionType;
    switch(action) {
            case constants.FEED_GETUSERS:
               _.each(payload.payload,function(user){
                FeedUserStore.addUser(user);
               });
               FeedUserStore.emitChange();
            break;
    }
   
});

module.exports = FeedUserStore;
