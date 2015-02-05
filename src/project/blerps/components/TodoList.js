var React = require('react');
var TodoItem = require('./TodoItem');
var _ = require("underscore");
var TodoActions = require('../TodoActions');
var isLoaded = false;
var load =[];
var loaded = [];
var loadBlerps = _.throttle(function(load){
    TodoActions.getById(load);
    // isLoaded = false;
},500);
module.exports = React.createClass({
    getInitialState: function(){
       return {
        
       }
    },
    componentWillReceiveProps: function(newProps){
        load =[];
        _.each(this.props.Todos,function(item){
             if(item.created == null) { 
                // if(!_.contains(loaded,item.b_id)){
                    load.push(item.b_id);
                // }
            }
        })
        //console.log(newProps)
        if(load.length > 0){
//TODO: move this logic.. it loads the feed twice... even with the throttle/debounce... 
            // loaded = load;
            loadBlerps(load);   
        }
    },
	componentDidMount: function(){
		//window.scrollTo(0,document.body.scrollHeight);
       
	},
    changeFilter:function(id){
        loaded = [];
        this.props.changeFilter(id);
    },
    showFilters: function(){
        this.setState({showFilters:this.state.showFilters});
    },
    render: function() {
        var chatFilter = "",
        fileFilter = "",
        taskFilter = "",
        eventFilter = "",
        noteFilter = "";
        var state = _.each(this.props.filters,function(d) {
            switch(d.id){
                case 1:
                    chatFilter = d.selected? "icon-checkbox-checked push":"icon-checkbox-unchecked push"
                break;
                case 2:
                    fileFilter = d.selected? "icon-checkbox-checked push":"icon-checkbox-unchecked push"
                break;
                case 3:
                    taskFilter = d.selected? "icon-checkbox-checked push":"icon-checkbox-unchecked push"
                break;
                case 4:
                    eventFilter = d.selected? "icon-checkbox-checked push":"icon-checkbox-unchecked push"
                break;
                case 5:
                    noteFilter = d.selected? "icon-checkbox-checked push":"icon-checkbox-unchecked push"
                break;
            }
        });
        var showClear = _.some(this.props.filters,function(filter){
            return filter.selected === true
        });
        var clearFilters = showClear? <div>
                        <button className="link-btn" onClick={this.props.clearFilters}>Clear all filters</button>
                    </div>
                    : "";
        var contFilters = <div className="filter-list">
                <div className="col-xxs-10">
                    <input type="text" placeholder="Search blerps" />
                </div>
                <div className="col-xxs-2">
                    <button>
                        <i className="icon-search" />
                    </button>
                </div>
                <div className="clear" />
                    <h3>Filters</h3>
                    <p className="">Select the types of blerps you would like to see in the feed</p>
                    {clearFilters}
                    <div>
                        <button className="link-btn blue" onClick={this.changeFilter.bind(this, 1)}>
                            <span>Chat</span> <i className={chatFilter} />
                        </button>
                        <div className="clear" />
                    </div>
                    <div>
                        <button className="link-btn grey" onClick={this.changeFilter.bind(this, 2)}>
                           <span>File</span> <i className={fileFilter} />
                        </button>
                        <div className="clear" />
                    </div>
                    <div>
                        <button className="link-btn green" onClick={this.changeFilter.bind(this, 3)}>
                            <span>Task</span> <i className={taskFilter} />
                        </button>
                        <div className="clear" />
                    </div>
                    <div>
                        <button className="link-btn red" onClick={this.changeFilter.bind(this, 4)}>
                            <span>Event</span> <i className={eventFilter} />
                        </button>
                        <div className="clear" />
                    </div>
                    <div>
                        <button className="link-btn orange" onClick={this.changeFilter.bind(this, 5)}>
                            <span>Note</span> <i className={noteFilter} />
                        </button>
                        <div className="clear" />
                    </div>
                </div>
        var smallFlyout = this.props.ShowFilters ? <div className="filter-list-btn clearfix">{contFilters}<button onClick={this.props.ToggleShowFilters}>Close</button></div> : "";
        var feed = this.props.Todos.length?  <ul className='list-unstyled convo-list col-xs-12 col-s-9 col-m-9'>
                    {this.props.Todos.map((todo)=>
                        <li key={todo._id}><TodoItem todo={todo} /></li>
                    )}
                </ul> : <div className="col-xxs-12">No blerps to show...</div>;
        return <div>
            <div className='fixed' >
            <div className='container'>
                <div className="col-xxs-9 col-s-6 hidden-s hidden-m hidden-l text-center push">
                    {smallFlyout}
                </div>
                <div className="col-xxs-3 hidden-xxs hidden-xs text-center push">
                     {contFilters}
                    </div>
                </div>
            </div>
        <div className='container' >
            <div className="row">
               {feed}
            </div>
        </div>
    </div>
    }
});
