var React = require('react');
var TodoActions = require('../TodoActions');
var TodoOptionCard = require('project/TodoOptionCard/TodoOptionCard');
var ChatBlerp = require('project/blerps/ChatBlerp');
var MediaBlerp = require('project/blerps/MediaBlerp');
var TaskBlerp = require('project/blerps/TaskBlerp');
var EventBlerp = require('project/blerps/EventBlerp');
var NoteBlerp = require('project/blerps/NoteBlerp')
, FeedUsersStore = require('project/feedUsers/FeedStore');
var _ = require('underscore');
module.exports = React.createClass({
    getInitialState: function() {
        return {
            user: FeedUsersStore.getUser(this.props.todo.owner)
        }
    },
    componentDidMount: function(){
        setTimeout(function(){ 
            //window.scrollTo(0,document.body.scrollHeight);
            window.scrollTo(0,0);
        },100);
    },
    render: function() {
        
        var blerpType = <div />;
        switch ( this.props.todo.type) {
            case 1 :
             blerpType = <ChatBlerp { ... this.props} user={this.state.user}/>
            break;
            case 2 :
             blerpType = <MediaBlerp { ... this.props} user={this.state.user} />
            break;
            case 3 :
             blerpType = <TaskBlerp { ... this.props} user={this.state.user} />
            break;
            case 4 :
             blerpType = <EventBlerp { ... this.props} user={this.state.user} />
            break;
            case 5 :
             blerpType = <NoteBlerp { ... this.props} user={this.state.user} />
            break;
        }

        var blerp = this.props.todo.type ? blerpType : <div className="loading-blerp" >LOADING...</div>
        return <div>
           {blerp}
        </div>
    }
});
