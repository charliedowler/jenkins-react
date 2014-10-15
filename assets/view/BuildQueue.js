var React = require('react');
var APIMixin = require('../mixin/APIMixin');
var StateMixin = require('../mixin/StateMixin');

module.exports = React.createClass({
  mixins: [APIMixin, StateMixin],
  getInitialState: function () {
    return {
      jobsInQueue: [],
      problem: null,
      solution: null
    }
  },
  componentWillMount: function () {
    this.execute('getJobsInQueue', function (err, results) {
      if (err) {
        // TODO: proper error handling
        this.setState({problem: err});
        return false;
      }
      this.setState({ jobsInQueue: JSON.parse(results).items });


      // TODO: mock data, didn't want to keep triggering jenkins builds
      if (true) {
        return false;
      }
      this.setState({ jobsInQueue: [
        {blocked: false, buildable: true, buildableStartMilliseconds: 1413236718895, id: 16, inQueueSince: 1413236718894, params: "", pending: false, stuck: false, task: { color: "blue", name: "tfl-bus-api", "url": "http://109.73.172.221:8080/job/tfl-bus-api/"}, url: "queue/item/16/", why: "Waiting for next available executor"}
      ] });
    }.bind(this));
  },
  render: function () {
    var queue = this.state.jobsInQueue.map(function (job) {
      return <li>{job.task.name}</li>;
    });
    return <div id="build-queue" className="ui segment">
    Build Queue ({queue.length})
      <ul>
      {queue.length ? queue : "No builds in queue."}</ul>
    </div>;
  }
});