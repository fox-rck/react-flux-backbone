'use strict';

var AppDispatcher = require('project/shared/dispatcher');
var EventEmitter = require('events').EventEmitter;
var constants = require('./constants');
var _ = require('underscore');

var _state = {
    // your state container where 
    users:[],
    searchUsers:[]
};


var ConnectionStore = _.extend({}, EventEmitter.prototype, {
    // Return State
    getState: function() {
        return _state;
    },
    addUser: function (user){
        _state.users.push(user);

    },
    addSearchedUser: function (user){
        _state.searchUsers.push(user);

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
    } ,
    clearSearchResults: function() {
        _state.searchUsers = [];
    } 
});

ConnectionStore.appDispatch = AppDispatcher.register(function(payload) {
    var action = payload.actionType;
    switch(action) {
         case constants.CONNECTION_ADD:
        // console.log("Store Dispatcher callback hit")
            ConnectionStore.addUser(payload.payload);
            ConnectionStore.emitChange();
        break;
        case constants.CONNECTIONS_GET:
           _.each(payload.payload,function(user){
            ConnectionStore.addUser(user);
           });
           ConnectionStore.emitChange();
        break;
        case constants.CONNECTIONS_FIND :
            _.each(payload.payload,function(user){
                ConnectionStore.addSearchedUser(user);
            });
           ConnectionStore.emitChange();
        break;
    }
   
});

module.exports = ConnectionStore;
