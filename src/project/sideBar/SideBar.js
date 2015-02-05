var React = require('react');
var TodoActions = require('project/blerps/TodoActions');
var dispatch = require('project/shared/helpers/dispatch');
var AppConstants = require('project/app/constants');
var AppStore = require('project/app/AppStore');
var GroupList = require('project/group/GroupList');
var UserList = require('project/people/ConnectionList');

module.exports = React.createClass({
    
    getInitialState: function(){
        return {
            app:AppStore.getState()
            , selectedNav: 0
        }
    },
    componentDidMount: function() {
        var that = this;
        document.getElementById("click-mask").addEventListener('click', this.toggleSideBar);
        //document.getElementById("header-profile-popout").addEventListener('click', this.preventClosePopup,false);
    },
    componentWillUnmount: function () {
        //document.getElementById("header-profile-popout").removeEventListener('click',this.preventClosePopup);
        document.getElementById("click-mask").removeEventListener('click',this.toggleSideBar);
        console.log("unmount")
    },
    setGroupSelected: function(){
        this.setState({selectedNav:0})
    },
    setPeopleSelected: function(){
        this.setState({selectedNav:1})
    },
    setPlacesSelected: function(){
        this.setState({selectedNav:2})
    },
    setTagsSelected: function(){
        this.setState({selectedNav:3})
    },
    addGroup: function(){
       
    },
    toggleSideBar: function(){
        dispatch(AppConstants.TOGGLESIDEBAR,{});
    },
    render: function() {
    var classNames = this.state.app.sideBarOpened ? "side-bar opened" : "side-bar";
    var maskClass = this.state.app.sideBarOpened?"sidebar-opened":"";
    var groupsSelected = this.state.selectedNav === 0 ? "active" : "";
    var peopleSelected = this.state.selectedNav === 1 ? "active" : "";
    var locationSelected = this.state.selectedNav === 2 ? "active" : "";
    var tagSelected = this.state.selectedNav === 3 ? "active" : "";
    var tabContent = "";
    switch (this.state.selectedNav){
        case 0:
            tabContent = <GroupList />;
        break;
        case 1:
            tabContent = <UserList />;
        break;
    }
    return <div><div className={classNames}>
        <div className='wrapper'>
            <button onClick={this.toggleSideBar} >
                <i className="icon-arrow-left" />
            </button>
            <div className="btn-group">
                <button className={groupsSelected} onClick={this.setGroupSelected}>
                    <i className="icon-bucket"></i>
                    <br />Feeds
                </button>
                <button className={peopleSelected} onClick={this.setPeopleSelected}>
                    <i className="icon-users"></i>
                    <br />People
                </button>
                <button className={locationSelected} onClick={this.setPlacesSelected}>
                    <i className="icon-location"></i>
                    <br />Places
                </button>
                <button className={tagSelected} onClick={this.setTagsSelected}>
                    <i className="icon-tag"></i>
                    <br />Tags
                </button>
            </div>
            <form>
                <input type="search" placeholder="Search" />
            </form>

        </div>
        {tabContent}
       
    </div>
    <div id="click-mask" className={maskClass}/>
    </div>
    }
});
