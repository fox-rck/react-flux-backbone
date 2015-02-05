var React = require('react');
var TodoActions = require('project/blerps/TodoActions');
var TodoOptionCard = require('project/TodoOptionCard/TodoOptionCard');
var moment = require('moment');
var BlerpDetails = require('project/blerpDetails/BlerpDetails');

moment().format('MMMM Do YYYY, h:mm:ss a'); // January 12th 2015, 5:17:27 pm
module.exports = React.createClass({
    
    getInitialState: function(){
        return {
            checked:this.props.todo.complete
            , showOptionCard:false
            , showBlerpPop: false
        }
    },

    onToggle: function() {
       //console.log(this.props.todo)
       var todo = this.props.todo;
       TodoActions.toggle(todo);
      // this.setState({checked:!this.state.checked})
    },
    hideItemPop: function() {
        TodoActions.addPopup(false);
        this.setState({showBlerpPop:false})
    },
    showItemPop: function() {
        TodoActions.addPopup(true);
        this.setState({showBlerpPop:true})
    },
    onRemove: function(ev) {
        ev.preventDefault();
        var todo = this.props.todo;
        TodoActions.remove(todo);
    },
    toggleOptionCard: function() {
       this.setState({showOptionCard:!this.state.showOptionCard})
    },
    render: function() {
        //console.log(this.props.todo.complete)
        var styles = {
            textDecoration: this.props.todo.complete ? 'line-through' : 'none'
        };
        var ownerUrl = "/#/users/"+ this.props.todo.owner;
        var showOptionCard = this.state.showOptionCard ? <TodoOptionCard closeOptions={this.toggleOptionCard} removeItem={this.onRemove} /> : " ";
        var itemPop = this.state.showBlerpPop ? <BlerpDetails blerp={this.props.todo} user={this.props.user} hideItemPop={this.hideItemPop}/>: "";
        return <div className="row no-gutter">
                    <div className="col-xxs-12">
                        <div className="themed-blerp orange" onClick={this.toggleOptionCard} >
                            <div>
                                <div className="right">
                                    <div className="time-stamp">
                                        {moment(this.props.todo.created).fromNow()}
                                        {'   '}<button className="link-btn" onClick={this.showItemPop}>
                                            <i className="icon-info" />
                                        </button>
                                    </div>
                                    <span className="icons">
                                        <a href="javascript:;" className="push triangle-border" onClick={this.showItemPop}>
                                            <span className="comment-count">{this.props.todo.comment_cnt}</span>
                                        </a>
                                    </span>
                                </div>
                                <div className="left user-img">               
                                    <a href="javascript:;" >
                                        <img src={this.props.user.UI} height="30" />
                                    </a> 
                                </div>
                                <div className="body">
                                    <a href={ownerUrl} className="user-name">{this.props.user.FN} {this.props.user.LN}</a>
                                  
                                      <div className="copy" style={styles}>{this.props.todo.text}</div>
                                </div>
                                
                                <div className="clear"></div>
                                {itemPop}
                            </div>
                        </div>
                    </div>
                </div>
       
    }
});
