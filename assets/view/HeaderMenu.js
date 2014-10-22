var _ = require('underscore');
var React = require('react/addons');
var Jobs = require('../collection/Jobs');
var RouterMixin = require('../mixin/RouterMixin');
var StateMixin = require('statemixin');

module.exports = React.createClass({
  mixins: [RouterMixin, StateMixin],
  debounce: 1000,
  getInitialState: function() {
    return {
      query: null,
      jobs: [],
      problem: null,
      results: []
    };
  },
  componentWillMount: function() {
    if (this.props.auth) {
      this.fetchJobs();
    }
  },
  fetchJobs: function() {
    var self = this;
    var jobs = new Jobs();
    jobs.root = this.props.root;
    jobs.on('all', function () {
      self.setState({ jobs: jobs });
    });
    jobs.fetch({
      error: function (models, response) {
        self.setState({ problem: response.statusCode });
      }
    });
  },
  selectJob: function(event) {
    this.state.router.navigate('job/' + event.target.getAttribute('data-id'), {trigger: true});
    this.refs.query.getDOMNode().value = event.target.getAttribute('data-id');
    this.setState({ results: [] });
  },
  render: function () {
    var results = this.state.results.map(function(result) {
      var name = result.get('name');
      return <li key={name} onClick={this.selectJob} data-id={name}>{name}</li>;
    }.bind(this));

    var SearchInput = function() {
      var field = <input type="text" onChange={this.handleQuery} ref="query" defaultValue={this.state.query} placeholder="Search..." />;
      if (!this.props.auth) {
        field.props.disabled = true;
      }
      return field;
    }.bind(this);

    return <div className="ui inverted menu">
      <a className="item" href="#" onClick={this.reset}>
        <i className="home icon"></i>
      Home </a>
      <div className="right menu">
        <div className="item">
          <div className="ui icon input">
            {SearchInput()}
            <i className="search link icon"></i>
          </div>
          <ul className={!this.state.results.length ? 'dropdown hidden' : 'dropdown'}>{results}</ul>
        </div>
        <a className={this.props.auth ? 'item' : 'item hidden'} href="#" onClick={this.logout}>
          <i className="sign out icon"></i>
        </a>
      </div>
    </div>;
  },
  reset: function() {
    this.state.router.navigate('/', { trigger: true });
  },
  handleQuery: function(event) {
    var query = event.target.value;

    if (!query) {
      this.setState({ query: null, results: [] });
      return false;
    }

    var results = this.state.jobs.filter(function(job) {
      var matcher = new RegExp(query, 'i');
      return matcher.test(job.get('name'));
    });

    this.setState({ query: query, results: results});
  },
  logout: function() {
    if (Storage) {
      delete localStorage.user;
      delete localStorage.pass;
    }
    window.location = '/logout';
  },
  componentWillReceiveProps: function(nextProps) {
    if (nextProps.root != this.state.root) {
      this.setState({ root: nextProps.root });
    }
    if (nextProps.auth && nextProps.auth != this.props.auth) {
      this.fetchJobs();
    }
  }
});
