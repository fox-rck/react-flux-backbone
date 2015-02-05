'use strict';
var React = require('react');
var AppConstants = require('project/app/constants');
var dispatch = require('project/shared/helpers/dispatch');
var UserActions = require('project/people/ConnectionActions')


module.exports = React.createClass({
	addConnection: function(){
        var term = this.props.user._id
        UserActions.add({user_id:term})

	},
    render: function() {
        return <div className='row'>
            <div className="col-xxs-2">
                <img className="pull" src={this.props.user.UI} />
            </div>
            <div className="col-xxs-10">
                <button className="link-btn" onClick={this.addConnection}><strong>ADD</strong> {this.props.user.FN+" "+this.props.user.LN}</button>
            </div>
        </div>
    }
});
