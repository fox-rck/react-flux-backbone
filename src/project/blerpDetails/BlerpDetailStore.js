'use strict';
var AppDispatcher = require('project/shared/dispatcher');
var EventEmitter = require('events').EventEmitter;
var constants = require('./constants');
var _ = require('underscore');

var _state = {
    // your state container where 
    shares:[],
    comments:[]
};


var BlerpDetailsStore = _.extend({}, EventEmitter.prototype, {
    // Return State
    getState: function() {
        return _state;
    },
    setBlerp: function (blerp){
        _state.blerp = blerp;
    },
    setShares: function (shares){
        _state.shares = shares;
    },
    setComments: function (comments){
        _state.comments = comments;
    },
    addComment: function (comment){
        _state.comments.push(comment);
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
        _state.shares = [];
        _state.comments = [];
    }
});

BlerpDetailsStore.appDispatch = AppDispatcher.register(function(payload) {
    var action = payload.actionType;
    switch(action) {
        case constants.BLEERPSHAREDFEEDS:
                BlerpDetailsStore.setShares(payload.payload)
                BlerpDetailsStore.emitChange();
        break;
        case constants.GETCOMMENTS:
                BlerpDetailsStore.setComments(payload.payload)
                BlerpDetailsStore.emitChange();
        break;
        case constants.ADDCOMMENT:
                BlerpDetailsStore.addComment(payload.payload)
                BlerpDetailsStore.emitChange();
        break;
    }
   
});

module.exports = BlerpDetailsStore;
