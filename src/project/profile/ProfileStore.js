'use strict';

var AppDispatcher = require('project/shared/dispatcher');
var EventEmitter = require('events').EventEmitter;
var constants = require('./constants');
var _ = require('underscore');

var _state = {
    // your state container where 
    users:[]
};


var ProfileStore = _.extend({}, EventEmitter.prototype, {
    // Return State
    getState: function() {
        return _state;
    },
    addUser: function (user){
        _state.users = [user];
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
    } 
});

ProfileStore.appDispatch = AppDispatcher.register(function(payload) {
    var action = payload.actionType;
    switch(action) {
         case constants.PROFILE_GET:
        // console.log("Store Dispatcher callback hit")
            ProfileStore.addUser(payload.payload[0]);
            ProfileStore.emitChange();
        break;
    }
   
});

module.exports = ProfileStore;
