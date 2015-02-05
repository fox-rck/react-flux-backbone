require('./shared/polyfills/Object.assign');

var React = require('react');
React.initializeTouchEvents(true);
var App = require('./app/components/App');


React.renderComponent(<App />, document.getElementById('app'));
