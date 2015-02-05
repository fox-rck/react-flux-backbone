'use strict';

var React = require('react')
, storeMixin = require('project/shared/helpers/storeMixin')
, UserActions = require('project/feedUsers/UserActions')
, FeedUsersStore = require('project/feedUsers/FeedStore');


module.exports = React.createClass({
    mixins: [storeMixin(FeedUsersStore)],
    getInitialState: function() {
        return {
            feedUsers: FeedUsersStore.getState()
        }
    },
    getInitDataIfNeeded: function() {
        var meta = FeedUsersStore.getState();
        if(meta.users.length <= 0){
           UserActions.getFeedUsers(this.props.users);
        }

    },
     _onChange: function() {
        this.setState({feedUsers:FeedUsersStore.getState()});
    },
    goToProfile: function(id){
        var url = "/#/users/"+id;
        window.location = url;
    },
    componentDidMount: function(){
       //UserActions.getFeedUsers(this.props.users);
    },
    render: function() {
      return <div className="group-users">
            <div className="group-user container"> 
            	Users: <button className="push link-btn" onClick={this.props.Close}>Close</button>
                {this.state.feedUsers.users.map((user)=>
            	<div className="user-listing">
                    <div key={user._id} className="user-img" >
	            		<img height="15" src={user.UI} />
	            	</div>
	            	<div className="pull">
                        {user.FN}{" "}{user.LN} 
	            	</div>
                    <div className="push">
                        <button><i className="icon-speech-bubble" /></button>{" "}
                        <button onClick={this.goToProfile.bind(this,user._id)}><i className="icon-info"/></button>
                    </div>
	            	<div className="clear" />
            	</div>
                )}
            	<div className="">
            		<input type="text" placeholder="Search Users" />
            	</div>
            	
            </div>
      </div>
    }
});
