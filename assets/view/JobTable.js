var React = require('react');
var _ = require('underscore');
var APIMixin = require('../mixin/APIMixin');
var Jobs = require('../collection/Jobs');
var moment = require('moment');

module.exports = React.createClass({
  mixins: [APIMixin],
  getInitialState: function () {
    return {
      jobs: [],
      problem: null,
      solution: null
    }
  },
  componentWillMount: function () {
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
  render: function () {
    var noPassing = 0;
    var noFailing = 0;

    var jobs = this.state.jobs.map(function (job) {
      // TODO: This condition will probably fail if it hasn't been built yet
      var lastBuild = job.get('lastBuild');
      var lastFailedBuild = job.get('lastFailedBuild');
      var lastSuccessfulBuild = job.get('lastSuccessfulBuild');
      if (!job.get('healthReport') || (!lastSuccessfulBuild.timestamp) || !lastFailedBuild.timestamp) {
        return <tr>
          <td>Loading...</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>;
      }
      (job.get('lastBuild').result == 'SUCCESS') ? noPassing++ : noFailing++;
      var isPassing = job.get('color') == 'blue';
      var daysSinceSuccessfulBuild = moment(new Date(lastSuccessfulBuild.timestamp));
      daysSinceSuccessfulBuild = moment().diff(daysSinceSuccessfulBuild, 'days');
      var daysSinceFailedBuild = moment(new Date(lastFailedBuild.timestamp));
      daysSinceFailedBuild = moment().diff(daysSinceFailedBuild, 'days');
      var healthReport = job.get('healthReport')[0];
      // TODO: Show tooltip on healthReport icon => healthReport.description
      // TODO: lastBuild.duration seems to be be different every time, wtf...
      return <tr>
        {isPassing ? <td className="positive">
          <i className="icon checkmark"></i>
        Passing</td> : <td className="negative">
          <i className="icon close"></i>
        Failing</td> }
        <td>
          <img src={"/images/" + healthReport.iconUrl}/>
        </td>
        <td>{job.get('name')}</td>
        <td>{daysSinceSuccessfulBuild} days ago</td>
        <td>{daysSinceFailedBuild} days ago</td>
        <td>{moment().millisecond(lastBuild.duration).format('ss')} seconds</td>
      </tr>;
    }.bind(this));

    return <table className="ui five column table segment">
      <thead>
        <tr>
          <th>Status</th>
          <th>Weather</th>
          <th>Name</th>
          <th>Last Success</th>
          <th>Last Failure</th>
          <th>Last Duration</th>
        </tr>
      </thead>
      <tbody>
      {jobs}
      </tbody>
      <tfoot>
        <tr>
          <th>{noPassing} passing</th>
          <th>{noFailing} failing</th>
          <th></th>
          <th></th>
          <th></th>
          <th></th>
        </tr>
      </tfoot>
    </table>;
  }
})