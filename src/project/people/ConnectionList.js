var React = require('react');
var storeMixin = require('project/shared/helpers/storeMixin');
var PeopleItem = require('project/people/ConnectionItem');
var PeopleSearchItem = require('project/people/ConnectionSearchItem');
var PeopleStore = require('project/people/ConnectionStore');
var PeopleAction = require('project/people/ConnectionActions');

module.exports = React.createClass({
    mixins: [storeMixin(PeopleStore)],
    getInitialState: function(){
        return {
            peopleStore: PeopleStore.getState()
            , addOpen:false
            , openAdvanced:false
        }
    },
    _onChange: function() {
        this.setState({peopleStore:PeopleStore.getState()});
    },
    getInitDataIfNeeded: function() {
        var meta = PeopleStore.getState();
        if(meta.users.length != 0){
           PeopleAction.get({p:1});
        }

    },
    goToFeed: function(){

    },
	componentDidMount: function(){
		//Load Groups
        PeopleAction.get({p:1});
	},
    findPerson: function(){
        var title = this.refs.title.getDOMNode().value;
        console.log(title);
        if(title != ""){
            PeopleAction.find({term:title}); 
        }
        // this.toggleAdd();
    },
    toggleAdd: function(){
        console.log("hit")
        if(this.state.addOpen === true){
             this.setState({openAdvanced:false});
        }
        this.setState({addOpen:!this.state.addOpen});

    },
    render: function() {
        var addNew = this.state.addOpen? <div className="add-group">
        <h3>Add a Connection</h3>
        
        <div className="row">
            <ul className='list-unstyled col-xxs-12'>
                {this.state.peopleStore.searchUsers.map((user)=>
                    <li key={"sper-"+user._id}><PeopleSearchItem  user={user} /></li>
                )}
            </ul>
        </div>
        <div className="clear"/>
        <input type="text" ref="title" placeholder="Search for users" />
        <button onClick={this.findPerson}>Find</button>{" "}
        <button  onClick={this.toggleAdd}>Cancel</button>
        </div>:"";
        var addNewBtn = this.state.addOpen?"":<button className="add-new" onClick={this.toggleAdd}><i className="icon-plus" /></button>

      return <div>
                <div className="row people-list">
                    <div className='list-unstyled col-xxs-12'>
                        {this.state.peopleStore.users.map((user)=>
                            <div key={"per"+user._id}><PeopleItem  user={user} /></div>
                        )}
                    </div>
                </div>
            {addNewBtn}
            {addNew}
             
            </div>

    }
});
