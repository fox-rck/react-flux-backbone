var React = require('react');


module.exports = React.createClass({
    getInitialState: function() {
        return {
            value: this.props.value
        };
    },

    componentWillReceiveProps: function(newProps) {
        this.setState({ value: newProps.value || "" });
    },

    onChange: function() {
        this.setState({ value: this.refs.input.getDOMNode().value });
    },

    onSubmit: function(ev) {
        ev.preventDefault();
        this.refs.input.getDOMNode().blur();
        this.props.onSubmit(this.state.value);
        this.setState({ value: "" });
    },

    render: function() {
        return <form onSubmit={this.onSubmit}>
            <input {...this.props} type="text" ref="input" 
                value={this.state.value} onChange={this.onChange} />
        </form>
    }
});
