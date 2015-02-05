'use static';
var _ = require('underscore');
var db = require('monk')('localhost/v1demo');
var ObjectId=require('mongodb').ObjectID;

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
var managerUser = {
	add: function(data) {
		console.log("Add new User")
        var collection = db.get('users');
        return collection.insert(data, function(err) {
            console.log(data);
            return data;
         });
	}
    , login: function(EM,PW) {
        console.log("login user");
        var collection = db.get('users');
        return collection.findOne({EM:EM,PW:PW},function(err,user){
            console.log(user)
            return user
        })
        
    }
	, getById: function(data, session, socket) {
        console.log("Get user by ID");
        var collection = db.get('users');
        var findParams = {_id:ObjectId(data.payload.id)};
        collection.find( findParams, function(err,user) {
                var reply = JSON.stringify({ actionType: data.actionType, payload: user });
                socket.send('sync', reply);
             });
	}
	, updateId: function(id, session) {
        console.log("Update user by ID");
	}
	, remove: function(id, session) {
        console.log("remove user");
        return data.payload;
	}
    , getUsers: function(ids) {
        var findParams = {};
        if(ids.length > 0){
            var filterArray = [];
            _.each(ids,function(filter){
                filterArray.push(ObjectId(filter))
            })
            if(filterArray.length > 0){
                findParams._id = {$in:filterArray};
            }
        }
        console.log(findParams)
        var collection = db.get("users");
        return collection.find(findParams, function(err,users) {
            return users || [];
         });
    }
    , find: function(data, session, socket){
        var term = data.payload.term;
        //var isEmail = term.indexOf("@").length > 0 ?true:false;
        var isEmail = true;
        var collection = db.get("users");
        var findParams = {};
        console.log("searching "+term)
        if(isEmail) {
            findParams = {
                $and:[
                    {EM : term},
                    {_id:{$nin:[ObjectId(session.user._id)]}}
                ]
            }
            collection.find( findParams, function(err,users) {
                var reply = JSON.stringify({ actionType: data.actionType, payload: users });
                socket.send('sync', reply);
             });
        }
        
    }
};

module.exports = managerUser;