'use static';
var todo_data = require('./dataStore')
, _ = require('underscore');
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
var manageBlerps = {
	add: function(data,session){
		console.log("Add new");
        var new_todo = {
            text: data.payload.title,
            complete: false,
            saved: true,
            owner: session.user._id,
            created: new Date(),
            type: data.payload.type
        }
        switch (data.payload.type){
            case 3:
                new_todo.due_date = convertDate(data.payload.due_date);
                new_todo.reminder_date = convertDate(data.payload.reminder_date);
            break;
            case 4:
                new_todo.event_date = convertDate(data.payload.event_date);
                new_todo.reminder_date = convertDate(data.payload.reminder_date);
            break;
        }
        //todo_data[user_idx].todos.push(new_todo);

        var collection = db.get('blerps');
        return collection.insert(new_todo, function(err) {
            var collection = db.get('feedBlerps');
            var newMap = {
                f_id: data.payload.feed_id
                , b_id: new_todo._id,
                type: data.payload.type
            }
            collection.insert(newMap, function(err) {
                return new_todo;
            });
         });
	}
	, get: function(page, session){
	 	var user_idx;

        var collection = db.get('blerps');
        return collection.find({owner:session.user._id.toString() }, function(err,todos) {
            console.log(todos);
            return todos || [];
         });
	}
	, getByGroupId: function(_id,filters, session){
        var collection = db.get('feedBlerps');
        var findParams = {f_id: _id };
        if(filters.length > 0){
            var filterArray = [];
            _.each(filters,function(filter){
                if(filter.selected){
                    filterArray.push(filter.id)
                }
            })
            if(filterArray.length >0){
                findParams.type = {$in:filterArray};
            }
        }
        console.log(findParams);
        return collection.find(findParams, function(err,todos) {
            console.log(todos);
            return todos || [];
         });
    }
    , getByIds: function(_ids, session){
        //TODO: allow this to be a collection get
        // console.log(_ids)
        var collection = db.get('blerps');
        var query = {};
        var list = [];
        _.each(_ids,function(id){
            list.push(ObjectId(id));
        });
        if(list.length > 0) {
            query._id = {$in:list};
        }
        return collection.find(query, function(err,todo) {
            console.log(todo);
         });
    }
    , getById: function(data, session,socket){
        //TODO: allow this to be a collection get
        console.log("Inside Get By ID")
        var collection = db.get('blerps');
        collection.find({_id:ObjectId(data.payload)}, function(err,blerps) {
                var reply = JSON.stringify({ actionType: data.actionType, payload: blerps});
                socket.send('sync', reply);
         });
    },
    getShares: function(data, session, socket){
        //TODO: allow this to be a collection get
        var collection = db.get('feedBlerps');
        return collection.find({b_id:ObjectId(data.payload._id)}, function(err,blerps) {
            var loadTopics = async(function(){
                var feed = db.get("topics");
                var ret = [];
                   await(
                    _.each(blerps,function(topic){
                        console.log(topic);
                        var newfd = await(feed.find({feed_id:topic.f_id,owner:session.user._id},function(err,fd){
                            console.log("found")
                            console.log(fd);
                            return fd[0]||null;
                        }));
                        ret.push(newfd[0]);
                    })
                );
                return ret;
                });
                loadTopics().then(function(topics){
                     var reply = JSON.stringify({ actionType: data.actionType, payload: topics });
                    socket.send('sync', reply);
                })
            });
    }, getComments: function(data, session, socket){
        var collection = db.get('comments');
        return collection.find({b_id:ObjectId(data.payload.b_id)}, function(err,comments) {
            var loadUsers = async(function(){
                console.log(comments)
                var feed = db.get("users");
                var ret = [];
                   await(
                    _.each(comments,function(comment){
                        console.log(comment);
                        var newfd = await(feed.find({_id:ObjectId(comment.owner)},function(err,fd){
                            console.log("found")
                            console.log(fd);
                            return fd[0]||null;
                        }));
                        comment.owner = newfd[0];
                        ret.push(comment);
                    })
                );
                return ret;
                });
                loadUsers().then(function(comments){
                    var reply = JSON.stringify({ actionType: data.actionType, payload: comments });
                    socket.send('sync', reply);
                })
            });
    }
    , addComment: function(data, session, pub){
        var collection = db.get('comments');
        data.payload.b_id = ObjectId(data.payload.b_id);
        data.payload.created = new Date();
        data.payload.owner = session.user._id;
        collection.insert(data.payload, function(err,newCom) {
            var usr = {
                _id: session.user._id
                ,UI:session.user.UI
                ,FN:session.user.FN
                ,LN:session.user.LN
            };
            newCom.owner = usr;
            var reply = JSON.stringify({ actionType: data.actionType, payload: newCom});
            pub.publish('sync', reply);
        });
        var feed = db.get("blerps");
        feed.findAndModify({_id:ObjectId(data.payload.b_id)},{$inc:{comment_cnt:1}},function(err,fd){
            console.log("comment count incremented:"+fd )
        });
    }
    , toggleComplete: function(data, session){
        var collection = db.get('blerps');
        return collection.findAndModify({ '_id': ObjectId(data.payload.b_id) }, { $set: {complete:data.payload.complete }}, function(err, docs) { 
            //console.log("returning:"+docs)
            return docs || {}
        });
    }
	, updateId: function(id, session){

	}
	, remove: function(id, session){
        var user_idx;
        var userObj = _.each(todo_data,function(user,idx){
            if(user.user_id === session.user.UID){
                user_idx = idx;
            }
        });

        var todos = todo_data[user_idx].todos;
        todo_data[user_idx].todos = _.without(todo_data[user_idx].todos,data.payload);
        console.log(todo_data[user_idx].todos)
        return data.payload;
	}
};

module.exports = manageBlerps;