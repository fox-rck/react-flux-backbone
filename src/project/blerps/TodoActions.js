var constants = require('./constants');
var dispatch = require('project/shared/helpers/dispatch');

function AddClass(o,c,bAdd){
    var list = o.className.split(" ");
    if (list.indexOf(c)!==-1){
        if (!bAdd) delete list[list.indexOf(c)];
    }else{
        if (bAdd) list[list.length] = c;
    }
    o.className = list.join(" ");
}

module.exports = {
    add: function(todo) {
        Global.socket.emit("sync",{actionType:constants.TODO_ADD, payload: todo });
    },
    // added: function(data) {
    //     dispatch(constants.TODO_ADDED, data);
    // },
    toggle: function(todo) {
        //Can also send to dispatcher loading state... 
        //ex: send saving to dispatcher
        //    send saved to socket
        //    handle success or error from socket
        console.log(todo)
        todo.complete = !todo.complete;
        Global.socket.emit('sync',{actionType:constants.TODO_TOGGLE,payload:todo});
    },
    remove: function(todo) {
        //dispatch(constants.TODO_REMOVE, { payload: todo });
        console.log(todo)
        Global.socket.emit('sync',{actionType:constants.TODO_REMOVE,payload:todo});
    },
    get: function(page){
        Global.socket.emit('sync',{actionType:constants.TODOS_GET,payload:page});   
    },
    getByFeedId: function(data){
        Global.socket.emit('sync',{actionType:constants.TODOS_GETBYGROUPID,payload:data});   
    },
    getById: function(data){
        Global.socket.emit('sync',{actionType:constants.TODOS_GETBYID,payload:data});   
    },
    addPopup: function(x) {
        AddClass(document.documentElement, 'popup-opened', x);
    }
};
