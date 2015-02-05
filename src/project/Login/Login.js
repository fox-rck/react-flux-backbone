'use strict';
var React = require('react');


module.exports = React.createClass({
	LoginUser:function(){
		var data = 
            { EM: this.refs.email.getDOMNode().value
            , PW: this.refs.password.getDOMNode().value
            };
        //send to passed in function
		this.props.onAuth(data);
	},
    Register:function(){
        this.props.ToggleRegister();
    },
    render: function() {
        return <div className="container">
        <img src="images/logo.png" className="" height="80" />
        <h1>Sign In</h1>
        <input className="form-input" ref="email" type="text" placeholder="Email" />
        <input type="password" ref="password" placeholder="Password" />
        <button type="submit" onClick={this.LoginUser}>Sign In</button>{" "}
        <button onClick={this.Register}>Register</button>
        </div>
    }
});
