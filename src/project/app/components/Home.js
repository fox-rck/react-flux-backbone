var React = require('react');
var AppStore = require('project/app/AppStore');


module.exports = React.createClass({
	getInitialState: function(){
		return {
			appStore: AppStore.getState()
		}
	},
    render: function() {
    	var favorites = <div className="panel">
    	<h3>Current Location <a href="/#/current-location">View All</a></h3>
        <hr />
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
    	</div>;
    	var gettingStarted = <div>
    	<h3>Lets help you get Started !</h3>
        <p>BlerpiT, a place to centralize and collaborate your notes, photos, music, videos and other content which help you organize, optimize and streamline your life.  </p>
    	<p></p>
    	</div>;
        var today = new Date();
        var todayLink = "/#/todos/"+ today.getFullYear()+"-"+(today.getMonth()+1)+"-"+today.getDate();
    	var topPanel = false? {favorites}: {gettingStarted};
    	return <div className="container page-wrapper">
        <h2>Welcome, {this.state.appStore.users[0].FN || ""}</h2>
        {favorites}
        <div className="row">
            <div className="col-xs-7 panel">
             <h3>Glimpse at Today <a href={todayLink}>View All</a></h3>
                <hr />
                <p>You have no events, tasks or assigned blerps for today.</p>
            </div>
            <div className="col-xs-5 panel">
                <h3>Recent Activity <a href="/#/recent-activity">View All</a></h3>
                <hr />
            </div>
        </div>
        </div>
    }
});
