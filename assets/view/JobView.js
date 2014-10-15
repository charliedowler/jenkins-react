var React = require('react');
var APIMixin = require('../mixin/APIMixin');
var StateMixin = require('../mixin/StateMixin');

module.exports = React.createClass({
  mixins: [APIMixin, StateMixin],
  getInitialState: function() {
    return {
      report: null,
      info: null
    };
  },
  componentWillMount: function() {
    var job = this.props.job;
    this.execute('getLastBuildReport', job, function(err, res) {
      if (err) throw new Error(err);
      var report = JSON.parse(res);
      this.setState({ report: report});
    }.bind(this));
  },
  render: function() {
    return <div> {this.props.job} </div>;
  }
});