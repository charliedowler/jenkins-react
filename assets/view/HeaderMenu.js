var _ = require('underscore');
var React = require('react/addons');
var Jobs = require('../collection/Jobs');
var RouterMixin = require('../mixin/RouterMixin');

module.exports = React.createClass({
  mixins: [RouterMixin],
  routes: {
    'job/:name': 'inspectJob'
  },
  inspectJob: function(name) {
    // TODO: Show deeper job info
  },
  getInitialState: function() {
    return {
      query: null,
      jobs: [],
      problem: null,
      results: []
    };
  },
  componentWillMount: function() {
    var self = this;
    var jobs = new Jobs();
    jobs.root = this.props.root;
    jobs.on('all', function () {
      self.setState({ jobs: jobs });
    });
    jobs.fetch({
      error: function (models, response) {
        self.setState({ error: {
          problem: response.statusCode
        }})
      }
    });
  },
  selectJob: function(event) {
    this.navigate('job/' + event.target.getAttribute('data-id'), {trigger: true});
  },
  render: function () {
    var results = this.state.results.map(function(result) {
      return <li onClick={this.selectJob} data-id={result.get('name')}>{result.get('name')}</li>;
    }.bind(this));
    return <div className="ui inverted menu">
      <a className="item" href="/">
        <i className="home icon"></i>
      Home </a>
      <div className="right menu">
        <div className="item">
          <div className="ui icon input">
            <input type="text" onChange={this.handleQuery} defaultValue={this.state.query} placeholder="Search..." />
            <i className="search link icon"></i>
          </div>
          <ul className={!this.state.results.length ? 'dropdown hidden' : 'dropdown'}>{results}</ul>
        </div>
        <a className="item" href="#" onClick={this.logout}>
          <i className="sign out icon"></i>
        </a>
      </div>
    </div>;
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
  }
});

