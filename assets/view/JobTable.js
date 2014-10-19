var React = require('react');
var _ = require('underscore');
var moment = require('moment');
var Jobs = require('../collection/Jobs');
var APIMixin = require('../mixin/APIMixin');
var StateMixin = require('statemixin');

module.exports = React.createClass({
  mixins: [APIMixin, StateMixin],
  debounce: 1000,
  getInitialState: function () {
    return {
      jobs: [],
      problem: null,
      solution: null
    };
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
        }});
      }
    });
  },
  render: function () {
    var noPassing = 0;
    var noFailing = 0;

    var jobs = this.state.jobs.map(function (job) {
      // TODO: This condition will probably fail if it hasn't been built yet
      var lastBuild = job.get('lastBuild') || {};
      var lastFailedBuild = job.get('lastFailedBuild') || {};
      var lastSuccessfulBuild = job.get('lastSuccessfulBuild') || {};
      if (!job.get('healthReport')) {
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

      var buildStatus;

      switch (job.get('color')) {
        case 'blue':
          buildStatus = <td className="positive">
            <i className="icon checkmark"></i>
          Passing</td>;
          break;
        case 'blue_anime':
          buildStatus = <td className="neutral">
            <i className="refresh icon"></i>
          Building</td>;
          break;
        case 'red':
          buildStatus = <td className="negative">
            <i className="icon close"></i>
          Failing</td>;
          break;
        default:

          break;
      }

      var daysSinceSuccessfulBuild = lastSuccessfulBuild.timestamp ?
        moment(new Date(lastSuccessfulBuild.timestamp)) : 'N/A';
      daysSinceSuccessfulBuild = daysSinceSuccessfulBuild != 'N/A' ? moment().diff(daysSinceSuccessfulBuild, 'days') + ' days ago' : daysSinceSuccessfulBuild;

      var daysSinceFailedBuild = lastFailedBuild.timestamp ? moment(new Date(lastFailedBuild.timestamp)) : 'N/A';
      daysSinceFailedBuild = daysSinceFailedBuild != 'N/A' ? moment().diff(daysSinceFailedBuild, 'days') + '  days ago' : daysSinceFailedBuild;

      var lastDuration = lastBuild.duration ? moment().millisecond(lastBuild.duration).format('ss') + ' seconds' : 'N/A';

      var healthReport = job.get('healthReport')[0];
      // TODO: Show tooltip on healthReport icon => healthReport.description
      // TODO: lastBuild.duration seems to be be different every time, wtf...
      return <tr>
        {buildStatus}
        <td>
          <img src={"/images/" + healthReport.iconUrl}/>
        </td>
        <td>{job.get('name')}</td>
        <td>{daysSinceSuccessfulBuild}</td>
        <td>{daysSinceFailedBuild}</td>
        <td>{lastDuration}</td>
      </tr>;
    }.bind(this));

    return <table id="job-table" className="ui five column table segment">
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
