var Backbone = require('backbone');
var api = require('../api');
var _ = require('underscore');
var FetchMixin = require('../mixin/FetchMixin');

module.exports = Backbone.Model.extend({
  queue: [],
  url: function () {
    return 'http://localhost:3000/job_info?job=' + this.get('name');
  },
  initialize: function () {
    FetchMixin.call(this);
    this.fetch();
    this.on('change:lastSuccessfulBuild', _.once(this.getLastSuccessfulBuild), this);
    this.on('change:lastFailedBuild', _.once(this.getLastFailedBuild), this);
    this.on('change:lastBuild', _.once(this.getLastBuild), this);
  },
  getLastBuild: function() {
    if (!this.get('lastBuild')) return false;
    this.queue.push(api(this.root).buildInfo(this.get('name'), this.get('lastBuild').number, function(err, info) {
      this.set({lastBuild: JSON.parse(info)});
    }.bind(this)));
  },
  getLastSuccessfulBuild: function() {
    if (!this.get('lastSuccessfulBuild')) return false;
    this.queue.push(api(this.root).buildInfo(this.get('name'), this.get('lastSuccessfulBuild').number, function(err, info) {
      this.set({lastSuccessfulBuild: JSON.parse(info)});
    }.bind(this)));
  },
  getLastFailedBuild: function() {
    if (!this.get('lastFailedBuild')) return false;
    this.queue.push(api(this.root).buildInfo(this.get('name'), this.get('lastFailedBuild').number, function(err, info) {
      this.set({lastFailedBuild: JSON.parse(info)});
    }.bind(this)));
  },
  abort: function() {
    this.fetched.abort();
    this.queue.forEach(function(req) {
      if (!req._ended) req.abort();
    });
    this.queue = [];
  }
});
