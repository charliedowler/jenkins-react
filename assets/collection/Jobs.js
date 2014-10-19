var Backbone = require('backbone');
var Job = require('../model/Job');
var _ = require('underscore');

module.exports = Backbone.Collection.extend({
  model: Job,
  url: 'http://localhost:3000/all_jobs'
});