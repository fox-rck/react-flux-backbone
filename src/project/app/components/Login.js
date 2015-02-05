'use strict';
var React = require('react');


module.exports = React.createClass({
	LoginUser:function(){
		var data = {UN:this.refs.userName.getDOMNode().value,PW:this.refs.password.getDOMNode().value};

		this.props.onAuth(data);
	},
    Register:function(){
        this.props.ToggleRegister();
    },
    render: function() {
        return <div>
        <h1>Login</h1>
        <input className="form-input" ref="userName" type="text" placeholder="Username" />
        <input type="text" ref="password" placeholder="Password" />
        <input type="submit" value="Submit" onClick={this.LoginUser}/>
        <button onClick={this.Register}>Register</button>
        </div>
    }
});
