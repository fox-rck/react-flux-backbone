
var AppDispatcher = require('project/shared/dispatcher');
var EventEmitter = require('events').EventEmitter;
var constants = require('./constants');
var _ = require('underscore');

var _state = {
    // your state container where 
    todos:[]
};


var ToDoStore = _.extend({}, EventEmitter.prototype, {
    // Return State
    getState: function() {
        return _state;
    },
    addTodo: function (todo){
        if(todo.b_id == null){
            todo.b_id = todo._id
        }
        todo.comment_cnt = 0;
        _state.todos.unshift(todo);
    },
    updateCommentCount: function (comment) {
        _.each(_state.todos,function(model,idx){
            if(model.b_id === comment.b_id){
                model_idx = idx;
            }
        });
        //Check if model in collection
        if(model_idx != null){
            _state.todos[model_idx].comment_cnt = _state.todos[model_idx].comment_cnt+1;
            ToDoStore.emitChange();
        }
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
        _state.todos = [];
    }
});

ToDoStore.appDispatch = AppDispatcher.register(function(payload) {
    var action = payload.actionType;
    switch(action) {
         case constants.TODO_ADD:
            // console.log("Store Dispatcher callback hit")
             _.each(_state.todos,function(model,idx){
                    if(model.b_id === payload.payload.b_id){
                        model_idx = idx;
                    }
                });
                //Check if model in collection
               // console.log(model_idx)
                if(model_idx == null){
                    ToDoStore.addTodo(payload.payload);
                    ToDoStore.emitChange();
                }
                break;
            case constants.TODO_TOGGLE:
                var model_idx;
                _.each(_state.todos,function(model,idx){
                    if(model.b_id === payload.payload.b_id){
                        model_idx = idx;
                    }
                });
                //Check if model in collection
               // console.log(model_idx)
                if(model_idx != null){
                    _state.todos[model_idx].complete = payload.payload.complete;
                    //console.log(_state.todos[model_idx].complete)
                    ToDoStore.emitChange();
                }
            break;
            case constants.TODO_REMOVE:
            var model = _.filter(_state.todos,function(model){
                    return model._id === payload.payload._id
                })[0] || null;
                //Check if model in collection
                
                if (model) {
                    _state.todos = _.without(_state.todos,model);
                    ToDoStore.emitChange();
                }
         
                break;
            case constants.TODOS_GET:
               _.each(payload.payload,function(todo){
                ToDoStore.addTodo(todo);
               });
               ToDoStore.emitChange();
            break;
            case constants.TODOS_GETBYGROUPID:
                _state.todos = [];
                var model_idx;
               _.each(payload.payload,function(todo){
                    _.each(_state.todos,function(model,idx){
                        if(model.b_id === todo.b_id){
                            model_idx = idx;
                        }
                    });
                    if(model_idx == null){
                        ToDoStore.addTodo(todo);
                    }
               });
               ToDoStore.emitChange();
            break;
            case constants.TODOS_GETBYID:
            if(payload.payload[0]){
                _.each(payload.payload,function(item){
                    _.each(_state.todos,function(model,idx){
                        if(model.b_id === item._id){
                            model_idx = idx;
                        }
                    });
                    if(model_idx != null){
                        _state.todos[model_idx].owner = item.owner;
                        _state.todos[model_idx].text = item.text;
                        _state.todos[model_idx].type = item.type;
                        _state.todos[model_idx].created = item.created;
                        _state.todos[model_idx].comment_cnt = item.comment_cnt || 0;
                        switch(item.type){
                            case 3:
                                _state.todos[model_idx].complete = item.complete;
                                _state.todos[model_idx].due_date = item.due_date;
                                _state.todos[model_idx].reminder_date = item.reminder_date;
                            break;
                            case 4:
                                _state.todos[model_idx].event_date =  item.event_date;
                                _state.todos[model_idx].reminder_date = item.reminder_date;
                            break;
                        }
                    }
                }) 
                ToDoStore.emitChange();
            }
            break;
            case constants.ADDCOMMENT:
                ToDoStore.updateCommentCount(payload.payload);
            break;
    }
   
});

module.exports = ToDoStore;
