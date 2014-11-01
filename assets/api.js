var request = require('request');
var reqs = {};

var api = function(root, id) {

  function queue(req) {
    reqs[id] = reqs[id] || [];
    reqs[id].push(req);
  }

  return {
    'isRegistrationEnabled': function(cb) {
      queue(request.get({
        uri: root + '/login?from=%2F'
      }, function(err, response, body) {
        cb(err, /register/.test(body));
      }));
    }.bind(this),
    login: function(username, password, cb) {
      var uri = 'http://localhost:3000/login';
      queue(request.post({
        uri: uri,
        form: {
          root: root,
          username: username,
          password: password
        }
      }, function(err, response, body) {
        cb(err, response);
      }));
    },
    'getJobs': function(cb) {
      var uri = 'http://localhost:3000/all_jobs';
      queue(request(uri, function(err, response, body) {
        cb(err, body);
      }));
    },
    'jobInfo': function(job, cb) {
      var uri = 'http://localhost:3000/job_info?job=' + job;
      queue(request(uri, function(err, response, body) {
        cb(err, body);
      }));
    },
    'buildInfo': function(job, buildNumber, cb) {
      var uri = 'http://localhost:3000/build_info?job=' + job + '&build_number=' + buildNumber;
      queue(request(uri, function(err, response, body) {
        cb(err, body);
      }));
    },
    'getJobsInQueue': function(cb) {
      var uri = 'http://localhost:3000/queue';
      queue(request(uri, function(err, response, body) {
        cb(err, body);
      }));
    },
    'getLastBuildReport': function(job, cb) {
      var uri = 'http://localhost:3000/last_build_report?job=' + job;
      queue(request(uri, function(err, response, body) {
        cb(err, body);
      }));
    },
    'build': function(job, cb) {
      var uri = 'http://localhost:3000/build?job=' + job;
      queue(request(uri, function(err, response, body) {
        cb(err, body);
      }));
    }
  };
};

api.abort = function(id) {
  var requests = reqs[id];  
  for (var r in requests) {
    var req = requests[r];
    !req._ended && req.abort();
  }
  delete reqs[id];
};

module.exports = api;
