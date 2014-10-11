var React = require('react');
var LoginForm = require('./LoginForm');
var ConfigForm = require('./ConfigForm');
var HeaderMenu = require('./HeaderMenu');

module.exports = React.createClass({
  getInitialState: function () {
    return {
      root: null,
      user: null,
      pass: null
    }
  },
  componentWillMount: function () {
    if (Storage) {
      var user = localStorage['user'];
      var pass = localStorage['pass'];
    }
    this.setState({ root: this.props.root, user: user, pass: pass});
  },
  render: function () {

    var component = !this.state.root ? <ConfigForm onChange={this.handleConfigChange} /> : null;

    if (this.state.root && !this.state.user && !this.state.pass) {
      component = <LoginForm root={this.state.root} onLoggedIn={this.handleLoggedIn} />;
    }

    return <div id="app">
      <HeaderMenu root={this.state.root} />
    {component}
    </div>;
  },
  handleLoggedIn: function (username, password) {
    this.setState({ user: username, pass: password });
  },
  handleConfigChange: function (config) {
    this.setState(config);
    if (Storage) {
      localStorage['root'] = config.root;
    }
  }
});