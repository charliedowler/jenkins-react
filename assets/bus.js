var _ = require('underscore');
var Backbone = require('backbone');

module.exports = function() {
  return _.extend({}, Backbone.Events);
};
