'use strict';
var React = require('react');
var AppConstants = require('project/app/constants');
var dispatch = require('project/shared/helpers/dispatch');


module.exports = React.createClass({
	goToFeed: function(){
		dispatch(AppConstants.TOGGLESIDEBAR,{});
		var url = "#/topic/"+this.props.group.feed_id
		window.location = url;
	},
    render: function() {
    	var color = this.props.group.color;
        var style = {
        	borderLeftWidth: '3px',
        	borderLeftStyle: 'solid',
        	borderLeftColor: color
        }
        return <div style={style}>
            <button className="link-btn" onClick={this.goToFeed}>
            <img className="pull" src={this.props.group.photo} />
            {this.props.group.title}</button>
        </div>
    }
});
