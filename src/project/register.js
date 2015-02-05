'use strict';
var React = require('react');


module.exports = React.createClass({
	LoginUser:function(){
		var data = {UN:this.refs.userName.getDOMNode().value,PW:this.refs.password.getDOMNode().value};
		this.props.onAuth(data);
	},
    render: function() {
        return <form>
        <h1>Register</h1>
        <input className="form-input" ref="userName" type="text" placeholder="Username" />
        <input type="text" ref="password" placeholder="Password" />
        <input type="text" ref="reTypePassword" placeholder="Re-Type Password" />
        <input type="date" ref="birthday" placeholder="Birthday" />
        <input type="submit" value="Submit" onClick={this.LoginUser}/>
        </div>
    }
});
