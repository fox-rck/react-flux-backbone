var React = require('react');
var AppStore = require('project/app/AppStore');
var moment = require('moment');
module.exports = React.createClass({
	getInitialState: function() {
        return { };
    },
    render: function() {
        var date = (this.props.routeParams[0]||"").split("-");
        var jsDate = new Date(date[0],(date[1]-1),date[2])
        var Todo_Title = moment(jsDate).format("MMMM Do YYYY")
    	return <div className="page-wrapper container">
    	<h3>{Todo_Title}</h3>
        <span className="push"><button ><i className="icon-arrow-left"></i></button>&nbsp;<button ><i className="icon-arrow-right"></i></button></span>
          
        <p>Showing all events and tasks which have a reminder or are due on this day.</p>
        </div>
    }
});
