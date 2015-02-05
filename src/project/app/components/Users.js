var React = require('react');


module.exports = React.createClass({
	getInitialState: function() {
		return {
			curProfile:0
		}
	},
	componentDidMount: function(){
		if(this.props.routeParams && this.props.routeParams[0]) {
			this.setState({curProfile:this.props.routeParams[0]})
			console.log("initial Load of"+ this.props.routeParams[0])
		}
	},
	shouldComponentUpdate: function(nextProps, nextState) {
		var ret = false;
		if(nextProps){
    		ret = nextProps.routeParams[0] != this.state.curProfile;
    	}
    	return ret;
	},
	componentWillReceiveProps: function(newProps){
		//console.log(newProps);
		if(this.shouldComponentUpdate(newProps)) {
			console.log("gonna load" + newProps.routeParams[0])
			this.setState({curProfile: newProps.routeParams[0]})
		}
	},
    render: function() {
    	return <div className="container page-wrapper">
    	<div className="row">
    		<div className="col-xxs-3">
    			<img src="" />
    		</div>
    		<div className="col-xxs-9">
    		<h3>{this.state.curProfile} User Name</h3>
    		</div>
    	</div>
          
        </div>
    }
});
