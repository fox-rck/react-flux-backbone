var React = require('react');
var storeMixin = require('project/shared/helpers/storeMixin');
var RouterStore = require('../RouterStore');


module.exports = React.createClass({
    mixins: [RouterStore],

    getInitialState: function() {
        return { RouterStore: RouterStore };
    },
    componentDidMount: function() {
        RouterStore.on('all', function() {
            this.forceUpdate();
        }, this);
    },
    componentWillUnmount: function() {
        RouterStore.off(null, null, this);
    },
    getComponentClass: function(route) {
        switch (route) {
            case 'help':
                return require('project/app/components/Help');
            case 'users':
                return require('project/profile/Profile');
            case 'topic':
                return require('project/blerps/components/Todos');
            case 'todos':
                return require('project/todos/Todos');
            case 'favorites':
                return false;
            default:
                return require('project/app/components/Home');
        }
    },

    render: function() {
        var props = {
            route: this.state.RouterStore.get('route'),
            routeParams: this.state.RouterStore.get('params')
        };

        var Component = this.getComponentClass(props.route);
        return <Component {...props} />;
    }
});
