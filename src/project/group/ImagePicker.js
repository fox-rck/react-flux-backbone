'use strict';
var React = require('react');
var AppConstants = require('project/app/constants');
var dispatch = require('project/shared/helpers/dispatch');
module.exports = React.createClass({
	selectImage: function(){
	   this.props.setImg(this.props.img);
	},
    render: function() {
        return <button className="link-btn" onClick={this.selectImage}>
            <img src={this.props.img} />
        </button>
    }
});
