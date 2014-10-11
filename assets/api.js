var request = require('request');
module.exports = function(root) {
  this.jar = request.jar();
  return {
    'isRegistrationEnabled': function(cb) {
      request.get({
        uri: root + '/login?from=%2F',
        jar: this.jar
      }, function(err, response, body) {
        cb(err, /register/.test(body));
      });
    }.bind(this),
    login: function(username, password, cb) {
      var uri = root + 'api/json';
      request.post({
        uri: uri,
        jar: this.jar,
        auth: {
          user: username,
          pass: password
        }
      }, function(err, response, body) {
        cb(err, response);
      });
    }
  };
};