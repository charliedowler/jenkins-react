var request = require('request');
module.exports = function(root) {
  return {
    'isRegistrationEnabled': function(cb) {
      return request.get({
        uri: root + '/login?from=%2F'
      }, function(err, response, body) {
        cb(err, /register/.test(body));
      });
    }.bind(this),
    login: function(username, password, cb) {
      var uri = 'http://localhost:3000/login';
      return request.post({
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
      return request(uri, function(err, response, body) {
        cb(err, body);
      });
    },
    'jobInfo': function(job, cb) {
      var uri = 'http://localhost:3000/job_info?job=' + job;
      return request(uri, function(err, response, body) {
        cb(err, body);
      });
    },
    'buildInfo': function(job, buildNumber, cb) {
      var uri = 'http://localhost:3000/build_info?job=' + job + '&build_number=' + buildNumber;
      return request(uri, function(err, response, body) {
        cb(err, body);
      });
    },
    'getJobsInQueue': function(cb) {
      var uri = 'http://localhost:3000/queue';
      return request(uri, function(err, response, body) {
        cb(err, body);
      });
    },
    'getLastBuildReport': function(job, cb) {
      var uri = 'http://localhost:3000/last_build_report?job=' + job;
      return request(uri, function(err, response, body) {
        cb(err, body);
      });
    },
    'build': function(job, cb) {
      var uri = 'http://localhost:3000/build?job=' + job;
      return request(uri, function(err, response, body) {
        cb(err, body);
      });
    }
  };
};
