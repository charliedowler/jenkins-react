var request = require('request');
var reqs = {};

var api = function(root, id) {

  function queue(req) {
    reqs[id] = reqs[id] || [];
    reqs[id].push(req);
  }

  function get() {
    queue(request.get.apply(request, arguments));
  }

  function post() {
    queue(request.post.apply(request, arguments));
  }

  return {
    login: function(username, password, cb) {
      var uri = 'http://localhost:3000/login';
      post({
        uri: uri,
        form: {
          root: root,
          username: username,
          password: password
        }
      }, function(err, response, body) {
        cb(err, response);
      });
    },
    'getJobs': function(cb) {
      var uri = 'http://localhost:3000/all_jobs';
      get({
        uri: uri
      }, function(err, response, body) {
        cb(err, body);
      });
    },
    'jobInfo': function(job, cb) {
      var uri = 'http://localhost:3000/job_info?job=' + job;
      get({
        uri: uri
      }, function(err, response, body) {
        cb(err, body);
      });
    },
    'buildInfo': function(job, buildNumber, cb) {
      var uri = 'http://localhost:3000/build_info?job=' + job + '&build_number=' + buildNumber;
      get({
        uri: uri
      }, function(err, response, body) {
        cb(err, body);
      });
    },
    'getJobsInQueue': function(cb) {
      var uri = 'http://localhost:3000/queue';
      get({
        uri: uri
      }, function(err, response, body) {
        cb(err, body);
      });
    },
    'getLastBuildReport': function(job, cb) {
      var uri = 'http://localhost:3000/last_build_report?job=' + job;
      get({
        uri: uri
      }, function(err, response, body) {
        cb(err, body);
      });
    },
    'build': function(job, cb) {
      var uri = 'http://localhost:3000/build?job=' + job;
      get({
        uri: uri
      }, function(err, response, body) {
        cb(err, body);
      });
    }
  };
};

api.abort = function(id) {
  var requests = reqs[id];
  for (var r in requests) {
    var req = requests[r];
     if (!req._ended) {
       req.abort();
     }
  }
  delete reqs[id];
};

module.exports = api;
