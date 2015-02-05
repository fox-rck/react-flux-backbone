// var Backbone = require('backbone');
// var Store = require('project/shared/libs/Store');
var AppDispatcher = require('project/shared/dispatcher');
var constants = require('./constants');
var helpers = require('project/shared/helpers/helpers');
var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');

var _state = {
    // your state container
    isAuthenticated: false
    , isRegistering:false
    , users: []
    , sideBarOpened: false   
};


var AppStore = _.extend({}, EventEmitter.prototype, {
    // Return State
    getState: function() {
            return _state;
    },
    setAuthentication: function(authed){
        _state.isAuthenticated = authed;
    },
    toggleSideBar: function() {
        _state.sideBarOpened = !_state.sideBarOpened;
    },
    toggleRegister: function() {
        _state.isRegistering = !_state.isRegistering;
    },
    addUser: function (user){
        _state.users.push(user);
       // this.emitChange();
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


AppStore.appDispatch = AppDispatcher.register(function(payload) {
    var action = payload.actionType;
    switch(action) {
        case constants.AUTHENTICATED:
            // helpers.log("AUTHENTICATED inside App store");
            helpers.log(payload.payload.UN);
            var user = payload.payload;
            AppStore.setAuthentication(true);
            AppStore.addUser(user);
        break;
        case constants.LOGOFF:
            // helpers.log("AUTHENTICATED inside App store");
            //helpers.log(payload.payload.UN);
            var user = payload.payload;
            user.set({isAuthenticated:false});
        break;
        case constants.TOGGLESIDEBAR:
           AppStore.toggleSideBar();
        break;
        case constants.TOGGLEREGISTER:
           AppStore.toggleRegister();
        break;
    }
    AppStore.emitChange();
});
module.exports = AppStore;