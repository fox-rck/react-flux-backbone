var React = require('react');
var RouterLink = require('project/router/components/RouterLink');

module.exports = React.createClass({
    closePopup: function(ev){
         console.log("doc clicked")
         this.props.closePopup(ev);
    },
     preventClosePopup: function(x){
        x.stopPropagation();
    },
    componentDidMount: function() {
        var that = this;
        document.addEventListener('click', this.closePopup);
        //document.getElementById("header-profile-popout").addEventListener('click', this.preventClosePopup,false);
    },
    componentWillUnmount: function () {
        //document.getElementById("header-profile-popout").removeEventListener('click',this.preventClosePopup);
        document.removeEventListener('click',this.closePopup);
        console.log("unmount")
    },
    getInitialState: function() {
        return {
        }
    },
    getUserName: function (){
        return this.props.getUser() != null ?this.props.getUser().UN : "";
    },
    getUserImage: function(){
        return this.props.getUser() != null?this.props.getUser().UI : "";
    },
    getUserId: function(){
        return this.props.getUser != null ? this.props.getUser()._id : 0;
    },
    signout: function(){
        console.log("signout")
        this.props.logoff();
    },
    render: function() {
        return <div className="header-profile-popout" id="header-profile-popout">
            <div className="row">
                <div className="col-xxs-4">
                    <span className="profile-img">
                        <img className="popout-profile-img" src={this.props.user.UI} height="30" />
                        <a href="javascript:;" >
                        Change Photo
                        </a>
                    </span>
                </div>
                <div className="col-xxs-8">
                    <div className="text-center">
                        <strong>{this.props.user.FN}&nbsp;{this.props.user.LN}</strong>
                        <div>{this.props.user.EM}</div>
                    </div>
                    <div className="clear"></div>
                    <p className="text-center">
                        <a href="/">Account</a>{' '}
                        -{' '}
                        <a href="/">Settings</a>
                    </p>
                    <div className="clear"></div>
                    <div className="text-center">
                        <RouterLink href={"/users/"+this.props.user._id} className="center block" >View Profile</RouterLink> 
                    </div>
                    <div className="clear"></div>
                </div>
                <div className="clear"></div>
                <hr/>
                <div className="clear"></div>
                <div className="col-xxs-12">
                    <button type="button">Add Account</button>
                    <button type="button" className="push" onClick={this.signout}>Sign Out</button>
                </div>
                <div className="clear"></div>
                <hr/>
                <div className="clear"></div>
                <div className="col-xxs-12 text-center">
                    <RouterLink href="/help">Help</RouterLink>&nbsp;-&nbsp;
                    <a href="/">About</a>&nbsp;-&nbsp;
                    <a href="/">Contact</a>&nbsp;-&nbsp;
                    <a href="/">Privacy</a>
                </div>
            </div>
        </div>
    }
});
