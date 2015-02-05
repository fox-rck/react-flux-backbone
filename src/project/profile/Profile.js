var React = require('react')
, storeMixin = require('project/shared/helpers/storeMixin')
, ProfileStore = require('project/profile/ProfileStore')
, ProfileActions = require('project/profile/ProfileActions');


module.exports = React.createClass({
    mixins: [storeMixin(ProfileStore)],
    getInitialState: function() {
        return {
            profileStore: ProfileStore.getState()
            , curProfile:0
        }
    },
    componentDidMount: function(){
        if(this.props.routeParams && this.props.routeParams[0]) {
            this.setState({curProfile:this.props.routeParams[0]})
            console.log("initial Load of"+ this.props.routeParams[0])
            ProfileActions.get({id: this.props.routeParams[0]})
        }
    },
    loadNewProfile: function(nextProps, nextState) {
        var ret = false;
        if(nextProps && this.state.profileStore.users[0]){
            ret = nextProps.routeParams[0] != this.state.curProfile;
        }
        return ret;
    },
    componentWillReceiveProps: function(newProps){
        //console.log(newProps);
        if(this.loadNewProfile(newProps)) {
            console.log("gonna load" + newProps.routeParams[0])
            this.setState({curProfile: newProps.routeParams[0]})
            ProfileActions.get({id: newProps.routeParams[0]})

        }
    },
    getInitDataIfNeeded: function(newProps) {

    },
    _onChange: function() {
        console.log("change")
        this.setState({ profileStore: ProfileStore.getState()})
    },
    render: function() {
        console.log(this.state.profileStore.users[0])
        var imgUrl = this.state.profileStore.users[0]?this.state.profileStore.users[0].UI : "";
        var name = this.state.profileStore.users[0]?(this.state.profileStore.users[0].FN || "") +" "+ (this.state.profileStore.users[0].LN || ""):"";
        return <div className="container page-wrapper">
        <div className="row">
            <div className="col-xxs-3">
                <img src={imgUrl} />
            </div>
            <div className="col-xxs-9">
            <h3>{name}</h3>
            </div>
        </div>
          
        </div>
    }
});
