'use strict';
var React = require('react');
var moment = require('moment');

module.exports = React.createClass({
    render: function() {
    	return <div className="media-body row comment">
    	<div className="left user-img">
            <img src={this.props.comment.owner.UI} />
        </div>
      	<div className="right time-stamp">
            {moment(this.props.comment.created).format('MMMM Do YYYY, h:mm a')}
        </div>
        <div className="body"> 
	        <div className="user-name">
	        {this.props.comment.owner.FN + this.props.comment.owner.LN}
	        </div>
	        <div className="copy">
	        {this.props.comment.title}
	        </div>
        </div>
        </div>
    }
});
