var React = require('react');
var JobTable = require('./JobTable');
var LoginForm = require('./LoginForm');
var ConfigForm = require('./ConfigForm');
var HeaderMenu = require('./HeaderMenu');
var BuildQueue = require('./BuildQueue');
var RouterMixin = require('../mixin/RouterMixin');

module.exports = React.createClass({
  mixins: [RouterMixin],
  routes: {
    'job/:name': 'inspectJob'
  },
  inspectJob: function(name) {
    // TODO: Show deeper job info
  },
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
    else if (this.state.root && this.state.user && this.state.pass) {
      component = <div className="ui grid" id="app-grid">
        <div className="three wide column">
          <BuildQueue root={this.state.root} />
        </div>
        <div className="thirteen wide column">
          <JobTable root={this.state.root} />
        </div>
      </div>;
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