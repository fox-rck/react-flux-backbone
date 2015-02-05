'use static';
var todo_data = require('./dataStore')
, _ = require('underscore');
var db = require('monk')('localhost/v1demo');
var async = require('asyncawait/async');
var await = require('asyncawait/await');

var convertDate = function(date) {
    //TODO: get user timeZoneOffset from user session or profile
    var userTimeZoneOffset = -6;
    //TODO: validate this logic
    // the value stored for the user should be absolute of what they entered
    // the timezone is only used when setting the alert/notifications
    var newDate = new Date(date);
    newDate.setHours(newDate.getHours() + userTimeZoneOffset)
    return newDate;
}
// This is the logic for managing the blerp resource
var managePeople = {
	add: function(data,session,socket){
		console.log("Add new Connection");
        var new_connection = {
            owner: session.user._id,
            connection_id: data.payload.user_id,
            created: new Date()
       }
        //todo_data[user_idx].todos.push(new_todo);
        var collection = db.get('connections');
        return collection.insert(new_connection, function(err) {
            console.log(new_connection);
            var reply = JSON.stringify({ actionType: data.actionType, payload: [new_connection] });
            socket.send('sync', reply);
         });
	}
	, get: function(data, session, socket){
        console.log("Get connections");
        var collection = db.get('connections');
        var users = db.get('users');
        var getConnections = async(function() {
            return collection.find({owner:session.user._id.toString()}, function(err,people) {
            });
        });
        getConnections().then(function(people){ 
            var getUsers = async(function(){
                var retUsers = [];
                await(
                    _.each(people,function(pep){
                        console.log(pep);
                        await(users.findById(pep.connection_id,function(err,fd){
                            console.log("found")
                            retUsers.push(fd);
                            return fd
                        }));
                        
                    })
                );
                return retUsers;
            });
            getUsers().then(function(connections){
                console.log("in return")
                console.log(connections)
                // var ret = _.map(connections,function(elm){

                // })
                var reply = JSON.stringify({ actionType: data.actionType, payload: connections });
                socket.send('sync', reply);
            })
        });
	}
	, getByIds: function(ids, session){
        var collection = db.get('people');
        return collection.find({owner:session.user._id.toString(), topic_type: 2 }, function(err,topics) {
            console.log(topics);
            return topics || [];
         });
	}
    , getByUserId: function(data, session, socket){
        var collection = db.get('people');
        return collection.find({owner:session.user._id.toString(), connection_id: 2 }, function(err,topics) {
            console.log(topics);
            return topics || [];
         });
    }
	, remove: function(id, session){
        //return data.payload;
	}
};

module.exports = managePeople;