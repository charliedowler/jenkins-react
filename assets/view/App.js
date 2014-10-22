var React = require('react');
var Backbone = require('backbone');
var JobView = require('./JobView');
var Grid = require('./Grid');
var JobTable = require('./JobTable');
var LoginForm = require('./LoginForm');
var ConfigForm = require('./ConfigForm');
var HeaderMenu = require('./HeaderMenu');
var BuildQueue = require('./BuildQueue');
var RouterMixin = require('../mixin/RouterMixin');

module.exports = React.createClass({
  mixins: [RouterMixin],
  routes: {
    '': 'showDefaultView',
    'job/:name': 'inspectJob',
    'job/:name/:build': 'inspectBuild'
  },
  getInitialState: function () {
    return {
      root: null,
      user: null,
      pass: null,
      job: null,
      build: null
    };
  },
  componentWillMount: function () {
    var user;
    var pass;
    if (Storage) {
      user = localStorage.user;
      pass = localStorage.pass;
    }
    this.setState({ root: this.props.root, user: user, pass: pass});
  },
  componentDidMount: function () {
    Backbone.history.start();
  },
  render: function () {

    var isValid = this.isValid();

    var component = !this.state.root ? <ConfigForm onChange={this.handleConfigChange} /> : null;

    if (this.state.root && !this.state.user && !this.state.pass) {
      component = <LoginForm root={this.state.root} onLoggedIn={this.handleLoggedIn} />;
    }
    else if (isValid && this.state.job) {
      component = <Grid id="app-grid">
        <div className="sixteen wide column">
          <JobView root={this.state.root} job={this.state.job} build={this.state.build} />
        </div>
      </Grid>;
    }
    else if (isValid) {
      component = <Grid id="app-grid">
        <div className="three wide column">
          <BuildQueue root={this.state.root} />
        </div>
        <div className="thirteen wide column">
          <JobTable root={this.state.root} />
        </div>
      </Grid>;
    }

    return <div id="app">
      <HeaderMenu root={this.state.root} auth={isValid} />
    {component}
    </div>;
  },
  isValid: function () {
    return !!(this.state.root && this.state.user && this.state.pass);
  },
  showDefaultView: function() {
    this.setState({ job: null, build: null });
  },
  inspectJob: function (name) {
    this.setState({ job: name });
  },
  inspectBuild: function (name, build) {
    this.setState({ job: name,  build: build });
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
