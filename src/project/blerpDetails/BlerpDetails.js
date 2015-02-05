var React = require('react');
var _ = require('underscore');
var storeMixin = require('project/shared/helpers/storeMixin');
var moment = require('moment');
var TodoActions = require('project/blerpDetails/BlerpDetailActions');
var DetailStore = require('project/blerpDetails/BlerpDetailStore');
var FeedStore = require('project/group/GroupStore');
var comment = require('project/blerpDetails/Comment')

module.exports = React.createClass({
    mixins: [storeMixin(DetailStore)],
    getInitialState: function() {
        return {
            blerp: null,
            user: null,
            tags : [],
            shares: [],
            showOptionsDropDrow:false,
            detailStore:DetailStore.getState(),
            newComment: ""
        }
    },
    componentDidMount: function(){
        this.setState({blerp:this.props.blerp});
        this.setState({user:this.props.user});
    },
    componentWillUnmount: function(){
        DetailStore.resetState();
    },
    _onChange: function() {
        this.setState({detailStore:DetailStore.getState()});
    },
    addComment: function() {
        var val = this.refs.comment.getDOMNode().value;
        if(val.trim() != ""){
            TodoActions.addComment({b_id: this.props.blerp.b_id, title: val});
            this.setState({newComment:""});
        }
    },
    handleChange: function(){
        this.setState({newComment:this.refs.comment.getDOMNode().value});
    },
    getInitDataIfNeeded: function() {   
        TodoActions.getFoundIn({_id:this.props.blerp.b_id})
        TodoActions.getComments({b_id:this.props.blerp.b_id})
    },
    toggleComplete: function(){
        TodoActions.toggle(this.props.blerp);
    },
    toggleOptions: function(){
        this.setState({showOptionsDropDrow:!this.state.showOptionsDropDrow})
    },
    render: function() {
        var eventDate;
        var monthNames = [ "JANUARY", "FEBUARY", "MARCH", "APRIL", "MAY", "JUNE",
            "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER" ];
        var Type = {title:"",icon:"",extra:""};
         switch ( this.props.blerp.type) {
            case 1 :
             Type.title = "Chat";
             Type.class = "summary blue";
             Type.icon = "icon-bubble";
            break;
            case 2 :
             Type.title = "File";
             Type.extra = <img className="blerp-img" src={this.props.blerp.photo || "images/137326.jpg"} />
             Type.class = "summary grey";
             Type.icon = "icon-attachment";
            break;
            case 3 :
             Type.title = "Task";
             Type.class = "summary green";
             Type.icon = "icon-checkbox-checked";
             var checkedClass = this.props.blerp.complete? "icon-checkbox-checked" : "icon-checkbox-unchecked";
             Type.extra = <div><button className="task-complete link-btn" onClick={this.toggleComplete}>
             <h3>Task is complete</h3>
             <i className={checkedClass} />
             </button>
             <div className="row">
                 <div className="col-xs-6"><strong>Due date:</strong> {moment(this.props.blerp.due_date).format('MMMM Do YYYY, h:mm a')}</div>
                 <div className="col-xs-6"><strong>Reminder date:</strong> {moment(this.props.blerp.reminder_date).format('MMMM Do YYYY, h:mm a')}</div>
            </div>
             </div>
            break;
            case 4 :
             eventDate = new Date(this.props.blerp.event_date);         
             Type.title = "Event";
             Type.class = "summary red";
             Type.icon = "icon-calendar";
             Type.extra = <div>
            <div className="col-xs-12">
                <div className="event-calendar">   
                    <div className="month">{monthNames[eventDate.getMonth()]}</div>
                    <div className="day">{eventDate.getDate()}</div>
                    <div className="year">{eventDate.getFullYear()}</div>
                    <div className="time">{moment(eventDate).format('h:mm a')}</div>
                    <i className="icon-calendar2" />
                </div>
            </div>
                    <div className="col-xs-12"><strong>Reminder date:</strong> {moment(this.props.blerp.reminder_date).format('MMMM Do YYYY, h:mm a')}</div>
                </div>
            break;
            case 5 :
             Type.title = "Note";
             Type.class = "summary orange";
             Type.icon = "icon-calendar";
            break;
        }
        var comments = this.state.detailStore.comments.length == 0?<p><small>Be the first to comment</small></p>:
        <div className="comment-box">
            { this.state.detailStore.comments.map((com)=>

                <comment comment={com} />
            )}
        </div>
        var tags = this.state.tags.length == 0? <div>There are no tags added to this blerp</div>:
        <div>
        ToDO: loop and render the tags
        </div>

        var foundIn = this.state.detailStore.shares.length == 0? <p>Loading...</p>:
        <div className="row no-gutter">{this.state.detailStore.shares.map((share)=>
            <div className="col-xxs-4 text-center">
            <img className="topic-img" src={share.photo}/> 
            <div style={{borderBottom:"3px solid "+share.color}}>{share.title}</div>
            </div>
            )}
        </div>;
        var optionsDropDown = !this.state.showOptionsDropDrow? "":<div className="options-drop-down">
            <div className="wrapper">
                <button>Share</button><br />
                <button>Edit</button><br />
                <button>Remove</button>
                
            </div>
        </div>
        var iconOptionsClass = !this.state.showOptionsDropDrow? "icon-arrow-down":"icon-arrow-up";
        var blerp = this.state.blerp == null? <div className="loading-blerp" >LOADING...</div> :
                <div>
                        <div className={Type.class}>
                            <div className="row">
                                <div className=" col-xxs-6 title">
                                    <i className={Type.icon}></i> {Type.title} 
                                </div>
                                <div className="col-xxs-6 ">
                                    <button className="push link-btn" onClick={this.toggleOptions}><i className={iconOptionsClass}/></button>
                                    <button className="push link-btn" onClick={this.props.hideItemPop}>Close</button>
                                 
                                 </div>

                            </div>
                            {optionsDropDown}
                        </div>
                        <div className="row">
                            <div className="col-xxs-12 text-center">
                            <p>{this.state.blerp.text}</p>
                            {Type.extra}
                            <div className="clear" />
                            </div>
                        </div>
                         <div className="clear" />
                        <div className="row">
                            <div className="col-xxs-12 ">
                            <hr />
                                {comments}
                                <div className="input-group add-comment">
                                <input type="text" ref="comment" placeholder="Add a comment" value={this.state.newComment} onChange={this.handleChange} className="add-comment"/><span className="supplement"><button onClick={this.addComment}>ADD</button></span>
                                </div>
                            </div>
                        </div>
                    <div className="row">
                        <div className="col-xs-4 col-xxs-12 text-center">
                            <strong className="">Added By:</strong>
                            <img className="owner-img" src={this.state.user.UI}/>
                            <div>
                                <strong>{this.state.user.FN} {this.state.user.LN}</strong>
                                <div className="clear" />
                               
                            </div>
                        </div>
                        <div className="col-xxs-12 col-xs-8">
                            <h4>Tags: <span className="push"><strong>+</strong> Add tag</span></h4>
                            There are no tags added to this blerp. 
                        </div>
                    </div>

                    <div className="row shade">
                        <div className="col-xs-4 col-xxs-12 text-center">
                         <strong className="">Added:</strong>
                                <div className="clear" />
                                <div className="" >{moment(this.props.blerp.created).format('MM/DD/YYYY, h:mm a')}</div>
                        </div> 
                        <div className="col-xxs-12 col-xs-4 text-center act-feed-btn">
                            <button>View Activity Feed</button>
                            <div className="clear"/>
                        </div>
                        <div className="col-xs-4 col-xxs-12 text-center">
                         <strong className="">Last Modified:</strong>
                                <div className="clear" />
                                <div className="" >{moment(this.props.blerp.created).format('MM/DD/YYYY, h:mm a')}</div>
                        </div>

                    </div>
                    <div className="row">
                        <div className="col-xxs-12">
                            <h4>Found in:<button className="push">Share</button></h4>
                            {foundIn}
                            
                        </div>
                    </div>
                </div>
        return <div className="blerp-popup">
        {this.state.detailStore.shares.length}
                    <div className="wrapper">
                         {blerp}
                    </div>
                </div> 
    }
});
