'use strict';

var AppDispatcher = require('project/shared/dispatcher');
var EventEmitter = require('events').EventEmitter;
var constants = require('./constants');
var _ = require('underscore');

var _state = {
    // your state container where 
    groups:[]
};


var GroupStore = _.extend({}, EventEmitter.prototype, {
    // Return State
    getState: function() {
        return _state;
    },
    addGroup: function (todo){
        _state.groups.push(todo);
    },
    updateGroup: function (group){
        console.log(group)
        _.each(_state.groups,function(grp){
            if(grp.feed_id == group._id){
                grp.title = group.title;
                grp.color = group.color;
                grp.photo = group.photo;
            }
        });
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

GroupStore.appDispatch = AppDispatcher.register(function(payload) {
    var action = payload.actionType;
    switch(action) {
         case constants.GROUP_ADD:
            // console.log("Store Dispatcher callback hit")
                GroupStore.addGroup(payload.payload);
                GroupStore.emitChange();
            break;
            case constants.GROUP_REMOVE:
            var model = _.filter(_state.groups,function(model){
                    return model._id === payload.payload._id
                })[0] || null;
                //Check if model in collection
                if (model) {
                    _state.groups = _.without(_state.groups,model);
                    GroupStore.emitChange();
                }
            break;
            case constants.GROUPS_GET:
               _.each(payload.payload,function(group){
                GroupStore.addGroup(group);
               });
               GroupStore.emitChange();
            break;
            case constants.GROUP_UPDATE:
               _.each(payload.payload,function(group){
                GroupStore.updateGroup(group);
               });
               GroupStore.emitChange();
            break;
    }
   
});

module.exports = GroupStore;
