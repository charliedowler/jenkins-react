var Backbone = require('backbone');
var Job = require('../model/Job');
var _ = require('underscore');
var $ = require('jquery');
Backbone.$ = $;
module.exports = Backbone.Collection.extend({
  model: Job,
  url: 'http://localhost:3000/all_jobs'
});