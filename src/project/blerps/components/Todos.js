var React = require('react');
var storeMixin = require('project/shared/helpers/storeMixin');
var TodoStore = require('../TodoStore');
var constants = require('../constants');
var TodoActions = require('../TodoActions');
var TodoForm = require('./TodoForm');
var TodoList = require('./TodoList');
var AppStore = require('project/app/AppStore');
var _ = require('underscore');
//TODO: Change name to FEED
var FeedStore = require('project/group/GroupStore');
var FeedUsers = require('project/feedUsers/FeedUsers')
, UserActions = require('project/feedUsers/UserActions')
, FeedUsersStore = require('project/feedUsers/FeedStore')
, FeedDetails = require('project/group/GroupDetails');


module.exports = React.createClass({
    mixins: [storeMixin(TodoStore),storeMixin(FeedUsersStore),storeMixin(FeedStore)],
    getInitialState: function() {
        return {todos:TodoStore.getState(),
            //app:AppStore.getState(),
            feedUsers: FeedUsersStore.getState(),
            feeds: FeedStore.getState(),
            showUsers: false,
            showFilters: false,
            activeGroup: 0,
            feedName:"",
            feedColor:"",
            feedPhoto:"",
            users:[],
            filters:[
                {id:1,selected:false},
                {id:2,selected:false},
                {id:3,selected:false},
                {id:4,selected:false},
                {id:5,selected:false},
            ],
            loadedUsers:false,
            loadedFeed:false,
            showDetails:false
        }
    },
    getFeed: function(id) {
        var model = _.filter(this.state.feeds.groups,function(model){
                    return model.feed_id == id
                })[0] || null;
                //Check if model in collection
                var ret = "";
                if(model){
                    ret =model;
                }
                return ret;
    },
    componentDidMount: function(){

        //alert(this.props.routeParams[0])
        if(this.props.routeParams && this.props.routeParams[0]) {
            //Get blerps
            TodoActions.getByFeedId({p:1,_id:this.props.routeParams[0]});
            //Set State
            this.setState({activeGroup:this.props.routeParams[0]});
            this.setState({feedName:this.getFeed(this.props.routeParams[0]).title});
            this.setState({feedColor:this.getFeed(this.props.routeParams[0]).color});
            this.setState({feedPhoto:this.getFeed(this.props.routeParams[0]).photo});
            this.setState({users:this.getFeed(this.props.routeParams[0]).users});
            

        }
        
    },
    componentWillUnmount: function(){
       TodoStore.resetState();
       FeedUsersStore.resetState();
    },
    componentWillReceiveProps: function(newProps) {
        //console.log("hit")
        if(newProps.routeParams && newProps.routeParams[0]) {
            if(this.state.activeGroup != newProps.routeParams[0]){
             this.setState({activeGroup: newProps.routeParams[0]});
             var state =[
                {id:1,selected:false},
                {id:2,selected:false},
                {id:3,selected:false},
                {id:4,selected:false},
                {id:5,selected:false}
            ];
            this.setState({filters:state});
                TodoActions.getByFeedId({p:1,_id:newProps.routeParams[0]});
            }
        }
    },
    getInitDataIfNeeded: function(newProps) {

        var meta = TodoStore.getState();
        // if(props.activeEntity && props.activeEntity !== meta.id) {

        //     EntityActions.getEntityData(this.props.activeEntity);
        if(!meta.todos.length){
            //no collection has been created...
        }
    },
    toggleShowUsers: function(){
        this.setState({showUsers:!this.state.showUsers})
    },
    toggleShowFilters: function(){
        this.setState({showFilters:!this.state.showFilters})
    },
    clearAllFilters: function(){
        TodoStore.resetState();
        var state =[
                {id:1,selected:false},
                {id:2,selected:false},
                {id:3,selected:false},
                {id:4,selected:false},
                {id:5,selected:false}
            ]
        this.setState({filters:state});
        TodoActions.getByFeedId({p:1,_id:this.props.routeParams[0],filters:state});
    },
    toggleShowDetails: function() {
        this.setState({showDetails:!this.state.showDetails});
    },
    changeFilter: function(e) {
        TodoStore.resetState()
        var id = e;
        var state = this.state.filters.map(function(d) {
            return {
                id: d.id,
                selected: (d.id === id ? !d.selected : d.selected)
            };
        });
        this.setState({ filters: state });
        TodoActions.getByFeedId({p:1,_id:this.props.routeParams[0],filters:state});
    },
    _onChange: function() {
        console.log("change")
        this.setState({todos:TodoStore.getState(),
           // app:AppStore.getState(),
            feeds: FeedStore.getState(),
        });
        this.setState({feedName:this.getFeed(this.props.routeParams[0]).title});
        this.setState({feedColor:this.getFeed(this.props.routeParams[0]).color});
        this.setState({feedPhoto:this.getFeed(this.props.routeParams[0]).photo});
        this.setState({users:this.getFeed(this.props.routeParams[0]).users});
        this.setState({FeedUsers:FeedUsersStore.getState()});
        var meta = this.state.feedUsers;
        if(meta.users.length <= 0 && !this.state.loadedUsers){
            if(this.state.users.length){
                this.setState({loadedUsers:true});
                UserActions.getFeedUsers(this.state.users);
            }
        }
    },
    render: function() {
        var grp =  {_id:this.state.activeGroup,title:this.state.feedName,color:this.state.feedColor, photo: this.state.feedPhoto};
        var details = this.state.showDetails? <FeedDetails group={grp} close={this.toggleShowDetails} />:"";
        var style = {
            borderBottomWidth: '3px',
            borderBottomStyle: 'solid',
            borderBottomColor: this.state.feedColor
        }
        var users = this.state.showUsers? <FeedUsers Close={this.toggleShowUsers } users={this.state.users}/> : "";  
        var userCount = this.state.users?this.state.users.length : 0;
        var feed = this.state.feedUsers.users.length > 0?<TodoList className="" clearFilters={this.clearAllFilters} ShowFilters={this.state.showFilters} filters={this.state.filters} changeFilter={this.changeFilter} ToggleShowFilters={this.toggleShowFilters} Todos={this.state.todos.todos} />:"";
        
        return <div>
            <div className="sub-header" style={style}>
                <div className='container'>
                    <div className='group-img pull'>
                    <button className="link-btn" onClick={this.toggleShowDetails}>
                        <img src={this.state.feedPhoto} />
                    </button>
                    </div>
                     <div className='pull' >
                     <button className="link-btn title" onClick={this.toggleShowDetails}>
                        {this.state.feedName}
                    </button>
                    </div>
                    <div className="push btn-group">
                        <button className='link-btn' onClick={this.toggleShowUsers}>
                                <i className='icon-users'></i>{' '}({userCount})
                        </button>
                        <button className='link-btn hidden-s hidden-m hidden-l' onClick={this.toggleShowFilters}>
                                <i className='icon-arrow-down'></i>
                        </button>
                    </div>
                    <div class="clear"></div>
                    {users}
                </div>
            </div>
            {feed}
            {details}
            <TodoForm activeTopic={this.state.activeGroup} />
        </div>
    }
});
