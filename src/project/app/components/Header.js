var React = require('react');
var RouterLink = require('project/router/components/RouterLink');
var ProfilePopout = require('project/profileHeadPop/profileHeadPop');
var TodoPopout = require('project/todoHeaderPop/TodoHeadPop');

module.exports = React.createClass({
    getInitialState: function() {
        return {
            profilePopOutOpen:false
            , todoPopOutOpen: false
        }
    },
    logout: function(){
        this.props.logoff();
    },
    toggleProfilePop: function(ev) {
        ev.preventDefault();
        this.setState({profilePopOutOpen: !this.state.profilePopOutOpen});
    },
    toggleTodoPop: function(ev) {
        ev.preventDefault();
        this.setState({todoPopOutOpen: !this.state.todoPopOutOpen});
    },
    toggleTodoPop: function(ev) {
        ev.preventDefault();
        this.setState({todoPopOutOpen: !this.state.todoPopOutOpen});
    },
    getUserId: function(){
        return this.props.getUser != null ?this.props.getUser.UID : null;
    },
    getDay: function(){
        var ret;
        var d = new Date();
        var month_day = d.getDate();
        var Nth = "th";
        if(month_day === 1 || month_day === 21 || month_day === 31){
            Nth = "st";
        }
        else if(month_day === 2 || month_day === 22){
            Nth = "nd";
        }
        else if(month_day === 3 || month_day === 23){
            Nth = "rd";
        }
        ret = {day:month_day,end:Nth};
        return ret;
    },
    getUserName: function(){
        return this.props.getUser != null ?this.props.getUser.UN : "";
    },
    getUserImage: function(){
        return this.props.getUser != null?this.props.getUser.UI : "";
    },
    toggleSideBar: function(){
       this.props.ToggleSideBar();
    },
    searchTermChange: function(ev){
        console.log(ev.target.value);
    },
    render: function() {
        var profileHeaderFlyout = this.state.profilePopOutOpen?<ProfilePopout user={this.props.getUser} logoff={this.logout} closePopup={this.toggleProfilePop}/>:"";
        var todoHeaderFlyout = this.state.todoPopOutOpen?<TodoPopout closePopup={this.toggleTodoPop} />:"";
        
        var nav = this.getUserId() != null?<div><ul className="list-inline">
                <li><RouterLink href="todos">Todos</RouterLink></li>
            </ul>
            <hr /> </div>:"";
            var day = this.getDay();
        return <div>
        <div className="row no-gutter header">
        <div className="col-xxs-6">
            <span className="header-logo">
                <a href="/#">
                    <img src="images/logo.png" />
                </a>
            </span>
            <button className='link-btn side-bar-trigger' onClick={this.toggleSideBar}>
                <i className='icon-dot-menu'></i>
            </button>
        </div>
        <div className="col-xxs-6">
            <a href="javascript:;" onClick={this.toggleProfilePop} className="push">
                <img className="header-profile-img" src={this.getUserImage()} height="30" />
            </a> 
            <a href="javascript:;" onClick={this.toggleTodoPop} className="push todos">
               <i className=""></i>
               <span className="todo-day">
                   {day.day}
                   <sup>{day.end}</sup>
               </span>
            </a>
            <a href="javascript:;" className="push notifications">
                 <i className="icon-bell"></i>
            </a>
            {todoHeaderFlyout}
            {profileHeaderFlyout}
        </div>
        </div>
            {nav}
        </div>
    }
});
