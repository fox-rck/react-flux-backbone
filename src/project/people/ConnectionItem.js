'use strict';
var React = require('react');
var AppConstants = require('project/app/constants');
var dispatch = require('project/shared/helpers/dispatch');
var UserActions = require('project/people/ConnectionActions')


module.exports = React.createClass({
    goToProfile: function() {
        dispatch(AppConstants.TOGGLESIDEBAR,{});
        var url = "/#/users/"+this.props.user._id;
        window.location = url;
    },
    render: function() {
        return <div className='row user-listing'>
            <div className="col-xxs-2">
                <img className="pull" src={this.props.user.UI} />
            </div>
            <div className="col-xxs-10">
                <div >{this.props.user.FN+" "+this.props.user.LN}
                    <div className="row">
                        <div className="push">
                        <button><i className="icon-speech-bubble" /></button>{" "}
                        <button onClick={this.goToProfile}><i className="icon-info"/></button>
                        </div>
                        <div className="clear" />
                    </div>
                </div>
            </div>
        </div>
    }
});
