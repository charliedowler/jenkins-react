var React = require('react');
var APIMixin = require('../mixin/APIMixin');
var StateMixin = require('statemixin');

module.exports = React.createClass({
  mixins: [APIMixin, StateMixin],
  getInitialState: function() {
    return {
      job: null,
      report: {},
      info: {}
    };
  },
  componentWillMount: function() {
    this.setBuildReport(this.props.job);
  },
  render: function() {
    return <div> {this.generateTitle()} <a href="#" onClick={this.triggerBuild}>Trigger build</a></div>;
  },
  triggerBuild: function(e) {
    e.preventDefault();
    this.execute('build', this.state.job, function() {

    }.bind(this));
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
      {this.state.job} is {status}
    </h1>;
  },
  componentWillReceiveProps: function(nextProps) {
    if (nextProps.job != this.state.job) {
      this.setBuildReport(nextProps.job);
    }
  }
});
