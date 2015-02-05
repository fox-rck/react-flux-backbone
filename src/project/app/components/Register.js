'use strict';
var React = require('react');


module.exports = React.createClass({
    getInitialState: function(){
        return {
            isValid: false
        }
    },
	Login:function(){
		this.props.ToggleRegister();
	},
    Register:function(){
       if(this.validate()){
        var data = {
                FN:this.refs.firstName.getDOMNode().value,
                LN:this.refs.lastName.getDOMNode().value,
                EM:this.refs.email.getDOMNode().value,
                PW:this.refs.pass.getDOMNode().value,
                BD:this.refs.birthday.getDOMNode().value
            };
            this.props.Register(data);
        }
        
    },
    validate: function(){
        var ret = false;
        if(this.refs.pass.getDOMNode().value === this.refs.rePassword.getDOMNode().value){
            ret = true;
        } else {
            //ToDo: show validation error
        }
        return ret;
    },
    selectBirthday: function(){
        NewCssCal('birthday','MMMddyyyy','dropdown',false);
    },
    render: function() {
        return <div className="container">
        <div className="row">
            <div className="col-s-4 col-xs-12">
                <img src="images/logo.png" className="" height="50" />
            </div>
            <div className="col-s-8 col-xs-12">
                <h1>Register</h1>
                <p>Welcome to blerpiT, a place to centralize and collaborate your notes, photos, music, videos and other content which help you organize, optimize and streamline your life.  </p>
            </div>
        </div>
        
        <div className="row">
            <div className="col-s-6 col-xs-12">
                <input className="form-input" ref="firstName" type="text" placeholder="First Name" />
            </div>
            <div className="col-s-6 col-xs-12">
                <input className="form-input" ref="lastName" type="text" placeholder="Last Name" />
            </div>
        </div>
        <input className="form-input" ref="email" type="text" placeholder="Email" />
        <input className="form-input" ref="re-email" type="text" placeholder="Re-Enter Email" />
        <input type="text" ref="pass"  placeholder="New password" />
        <input type="text" ref="rePassword"  placeholder="Re-Type password" />
        <div className="row">
            <div className="col-s-9 col-xs-12">
                <input type="text" onClick={this.selectBirthday} ref="birthday" id="birthday" placeholder="Birthday" />
            </div>
            <div className="col-s-3 col-xs-12">
                <a href="javascript:;" >Why do I need to provide my birthday?</a>
            </div>
        </div>
        <button onClick={this.Register}>Submit</button>{' '}
        <button onClick={this.Login}>Login</button>
        </div>
    }
});
