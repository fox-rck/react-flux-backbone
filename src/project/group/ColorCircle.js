'use strict';
var React = require('react');
var AppConstants = require('project/app/constants');
var dispatch = require('project/shared/helpers/dispatch');


module.exports = React.createClass({
	selectColor: function(){
	   this.props.setColor(this.props.color);
	},
    render: function() {
    	var color = this.props.color;
        var style = {
        	backgroundColor: color+" !important"
        }
        return <button className="link-btn color-circle" style={style} onClick={this.selectColor}>
        </button>
    }
});
