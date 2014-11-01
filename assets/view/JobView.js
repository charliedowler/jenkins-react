var React = require('react');
var APIMixin = require('../mixin/APIMixin');
var TimerMixin = require('../mixin/TimerMixin');
var StateMixin = require('statemixin');
var Grid = require('./Grid');

module.exports = React.createClass({
  mixins: [APIMixin, TimerMixin],
  getInitialState: function() {
    return {
      job: null,
      report: {},
      info: {}
    };
  },
  ticker: function() {
    if (this.ticks > 50) {
      this.clearInterval();
      return false;
    }
    if (this.state.job) {
      this.setBuildReport(this.state.job);
    }
    this.ticks++;
  },
  componentWillMount: function() {
    this.setBuildReport(this.props.job);
  },
  componentWillUnmount: function() {
    this.abort();
  },
  render: function() {
    return <Grid id="app-grid">
      <div className="sixteen wide column">
        <div> {this.generateTitle()} </div>
      </div>
    </Grid>;
  },
  triggerBuild: function(e) {
    e.preventDefault();
    this.execute('build', this.state.job, function() {});
  },
  setBuildReport: function(job) {
    this.execute('getLastBuildReport', job, function(err, res) {
      if (err) throw new Error(err);
      var report = JSON.parse(res);
      this.setState({ job: job, report: report });
    }.bind(this));
  },
  generateTitle: function() {
    var status;

    switch(this.state.report.result) {
      case 'SUCCESS':
        status = <b>passing.</b>;
        break;
      case 'FAILURE':
        status = <b>failing.</b>;
        break;
      case 'UNSTABLE':
        status = <b>unstable.</b>;
        break;
      case 'NOT_BUILT':
        status = <b>not built.</b>;
        break;
      case 'ABORTED':
        status = <b>aborted</b>;
        break;
      default:
        status = <b>building...</b>;
    }
    return <h1>
      {this.state.job} is {status} <i className={ this.state.report.building ? 'refresh icon building' : 'refresh icon'} onClick={this.triggerBuild}></i>
    </h1>;
  },
  componentWillReceiveProps: function(nextProps) {
    if (nextProps.job != this.state.job) {
      this.setBuildReport(nextProps.job);
      this.loadMixin();
    }
  }
});
