var React = require('react');
var TodoActions = require('project/blerps/TodoActions');


module.exports = React.createClass({
    componentDidMount: function(){
        
        document.addEventListener('click', this.closePopup);
    },
    closePopup: function(){
        this.props.closeOptions();
    },
    remove: function(ev){
        this.props.removeItem(ev);
    },
    componentWillUnmount: function () {
        //document.getElementById("header-profile-popout").removeEventListener('click',this.preventClosePopup);
        document.removeEventListener('click',this.closePopup);
        console.log("unmount")
    },
    getInitialState: function(){
        return {
        }
    },
    onClose: function(ev) {
        ev.preventDefault();
    },
    render: function() {
        var options = [

        ];
        //var ischecked = this.props.todo.get('complete') ? 'checked' : false
        return <div className="option-card">
            
            <button>Manage</button>{' '}
            <button onClick={this.remove}>Remove</button>
            <button>Share</button>
          
        </div>
    }
});
