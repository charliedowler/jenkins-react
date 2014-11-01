var React = require('react');
var App = require('./view/App');

React.renderComponent(<App root={window.Storage && localStorage.root} />, document.body);
