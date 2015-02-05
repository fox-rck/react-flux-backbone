var React = require('react');
var SingleInputForm = require('project/shared/components/SingleInputForm');
var TodoActions = require('../TodoActions');

module.exports = React.createClass({
    getInitialState:function(){
        return {selected: 0}
    },
    onSubmit: function() {
        var blerp = {
            title: this.refs.titleInput.getDOMNode().value,
            type: this.state.selected,
            feed_id: this.props.activeTopic
        };
        switch (this.state.selected){
            case 2 :
                    // '<input type="file" ref="attachedFile" />';
            break;
            case 3 :
               blerp.due_date = this.refs.due_date.getDOMNode().value;
               blerp.reminder_date = this.refs.reminder_date.getDOMNode().value;
            break;
            case 4 :
                blerp.event_date = this.refs.event_date.getDOMNode().value;
                blerp.reminder_date = this.refs.reminder_date.getDOMNode().value;
            break;
            case 5 :

            break;
        }
    	TodoActions.add(blerp);
        this.setState({selected: 0});
    },
    reset: function(){
        this.setState({selected: 0});
    },
    selectDueDate: function(){
        NewCssCal('due_date','MMMddyyyy','dropdown',true,'24',false,'future');
    },
    selectReminderDate: function(){
        NewCssCal('reminder_date','MMMddyyyy','dropdown',true,'24',false,'future');
    },
    addChat: function(){
        this.setState({selected: 1});
    },
    addFile: function(){
        this.setState({selected: 2});
    },
    addTask: function(){
        this.setState({selected: 3});
    },
    addEvent: function(){
        this.setState({selected: 4});
    },
    addNote: function(){
        this.setState({selected: 5});
    },
    render: function() {
        var addMessage = <SingleInputForm className='form-control' onSubmit={this.onSubmit} placeholder="Add a message.."  />;
        var chatclassName = this.state.selected == 1 ? "selected blue": "blue";
        var fileclassName = this.state.selected == 2 ? "selected grey": "grey";
        var taskclassName = this.state.selected == 3 ? "selected green": "green";
        var eventclassName = this.state.selected == 4 ? "selected red": "red";
        var noteclassName = this.state.selected == 5 ? "selected orange": "orange";
        var closeBtn = this.state.selected != 0 ? <div><button onClick={this.onSubmit}>Add</button>{' '}<button onClick={this.reset}>Close</button></div>: "";
        var formSection = <div />;
        switch (this.state.selected){
            case 1 :
                formSection = <input type="text" ref="titleInput" placeholder="Update your status" />;
            break;
            case 2 :
                formSection = <div>
                        <input type="text" ref="titleInput" placeholder="File description" />
                        <div className="second-row">
                            <input type="file" ref="attachedFile" />
                        </div>
                    </div>;
            break;
            case 3 :
                formSection = <div>
                        <input type="text" ref="titleInput" placeholder="Task description" />
                        <div className="second-row">
                            <div className="col-xxs-6">
                                <input type="text" ref="due_date"  onFocus={this.selectDueDate} onClick={this.selectDueDate} id="due_date" placeholder="Due date"  />
                            </div>
                            <div className="col-xxs-6">
                                <input type="text" ref="reminder_date" onFocus={this.selectReminderDate} id="reminder_date" placeholder="Reminder date" />
                            </div>
                        </div>
                    </div>
            break;
            case 4 :
                formSection = <div>
                        <input type="text" ref="titleInput" placeholder="Event description" />

                        <div className="second-row">
                            <div className="col-xxs-6">
                                <input type="text" ref="event_date" onFocus={this.selectDueDate} id="due_date" placeholder="Event date" />
                            </div>
                            <div className="col-xxs-6">
                                <input type="text" ref="reminder_date" onFocus={this.selectReminderDate} id="reminder_date" placeholder="Reminder date" />
                            </div>
                        </div>
                    </div>
            break;
            case 5 :
                formSection = <div><input type="text" ref="titleInput" placeholder="Note markdown text" />
                    <div className="btn-toolbar">
                        <div className="btn-group">
                            <a className="btn btn-default btn-xs" href="#"><span className="icon-bold" aria-hidden="true"></span></a>
                            <a className="btn btn-default btn-xs" href="#"><span className="icon-italic" aria-hidden="true"></span></a>
                            <a className="btn btn-default btn-xs" href="#"><span className="icon-underline" aria-hidden="true"></span></a>
                        </div>
                        <div className="btn-group">
                            <a className="btn btn-default btn-xs" href="#"><span className="icon-align-left" aria-hidden="true"></span></a>
                            <a className="btn btn-default btn-xs" href="#"><span className="icon-align-center" aria-hidden="true"></span></a>
                            <a className="btn btn-default btn-xs" href="#"><span className="icon-align-right" aria-hidden="true"></span></a>
                        </div>
                        <div className="btn-group">
                            <a className="btn btn-default btn-xs" href="#"><span className="icon-list-ol" aria-hidden="true"></span></a>
                            <a className="btn btn-default btn-xs" href="#"><span className="icon-list-ul" aria-hidden="true"></span></a>
                        </div>
                        <div className="btn-group">
                            <a className="btn btn-default btn-xs" href="#"><span className="icon-link" aria-hidden="true"></span></a>
                        </div>
                    </div>
                </div>

            break;

        }
        return <div id="add-new-form">
        	<div className="container">
                <div className="btn-group add-actions">
                    <button className={chatclassName} onClick={this.addChat}>
                        <i className="icon-bubble"></i> <span className="hidden-xxs">Chat</span>
                    </button>
                    <button className={fileclassName} onClick={this.addFile}>
                        <i className="icon-attachment"></i> <span className="hidden-xxs">File</span>
                    </button>  
                    <button className={taskclassName} onClick={this.addTask}>
                        <i className="icon-checkbox-checked"></i> <span className="hidden-xxs">Task</span>
                    </button>  
                    <button className={eventclassName} onClick={this.addEvent}>
                        <i className="icon-calendar"></i> <span className="hidden-xxs">Event</span>
                    </button>  
                    <button className={noteclassName} onClick={this.addNote}>
                        <i className="icon-note"></i> <span className="hidden-xxs">Note</span>
                    </button>  
                    <div className="clear"></div>
                </div>
                {formSection}
                {closeBtn}
        	</div>
        </div>
    }
});
