'use static';
var _ = require('underscore');
var db = require('monk')('localhost/v1demo');
var ObjectId=require('mongodb').ObjectID;
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
var manageGroups = {
	add: function(data,session,socket){
		console.log("Add new feed");
        console.log("TODO: Move users to feed table... so it is centralized")
        var new_topic = {
            title: data.payload.title,
            owner: session.user._id,
            created: new Date(),
            last_accessed: new Date(),
            last_modified: new Date(),
            color: data.payload.color || "#666666",
            photo: data.payload.photo || "/images/feed-placeholder-photo.jpg"
       }
        //todo_data[user_idx].todos.push(new_todo);
        var newFeed = {
            owner: session.user._id,
            created: new Date(),
            users:[session.user._id]
        }
        var feedCollection = db.get('feed');
        return feedCollection.insert(newFeed, function(err,newFeed) {
            new_topic.feed_id = newFeed._id.toString();
            var collection = db.get('topics');
            return collection.insert(new_topic, function(err) {
                console.log(new_topic);
                new_topic.users=[session.user._id]
                var reply = JSON.stringify({ actionType: data.actionType, payload: new_topic });
                socket.send('sync', reply);
             });
        });
        
	}
	, get: function(data, session,socket){
        console.log("get groups");
        var collection = db.get('topics');
        var loadGroups = async (function () {
            console.log("inside load group")
            return collection.find({owner:session.user._id.toString()});
        });
        loadGroups().then(function(topics){
            console.log("In loaded groups");
            console.log(topics);
            var loadUsers = async(function(){
                console.log("In loaded users");
                var feed = db.get("feed");
                var ret = [];
                await(
                    _.each(topics,function(topic){
                        console.log(topic);
                        var newfd = await(feed.findById(topic.feed_id,function(err,fd){
                            console.log("found")
                            console.log(fd);
                            return fd
                        }));
                        topic.users = newfd.users;
                        console.log("pushed topic")
                        ret.push(topic);
                    })
                );
                console.log("returning theRet")
                return ret;
            });
            loadUsers().then(function(ret){
                console.log("in return");
                console.log(ret)
                var reply = JSON.stringify({ actionType: data.actionType, payload: ret });
                socket.send('sync', reply);
                //return topics || [];
            });
        });
	}
	, getById: function(id, session){

	}
	, update: function(data, session, pub){
        console.log("update group")
         var collection = db.get('topics');
            return collection.update({feed_id:data.payload._id},{$set:
                {
                    title:data.payload.title
                    , color: data.payload.color
                    , photo: data.payload.photo

            }}, function(err,success) {
                console.log(success);
                var ret = [];
                if(success){
                    ret =[data.payload]
                }
                var reply = JSON.stringify({ actionType: data.actionType, payload: ret });
                pub.publish('sync', reply);
             });

	}
	, remove: function(id, session){
        //return data.payload;
	}
};

module.exports = manageGroups;