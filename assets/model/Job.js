var Backbone = require('backbone');
var api = require('../api');
var _ = require('underscore');

module.exports = Backbone.Model.extend({
  url: function () {
    return 'http://localhost:3000/job_info?job=' + this.get('name');
  },
  initialize: function () {
    this.root = this.collection.root;
    this.fetch();
    this.on('change:lastSuccessfulBuild', _.once(this.getLastSuccessfulBuild), this);
    this.on('change:lastFailedBuild', _.once(this.getLastFailedBuild), this);
    this.on('change:lastBuild', _.once(this.getLastBuild), this);
  },
  getLastBuild: function() {
    api(this.root)['buildInfo'](this.get('name'), this.get('lastBuild').number, function(err, info) {
      this.set({lastBuild: JSON.parse(info)});
    }.bind(this));
  },
  getLastSuccessfulBuild: function() {
    api(this.root)['buildInfo'](this.get('name'), this.get('lastSuccessfulBuild').number, function(err, info) {
      this.set({lastSuccessfulBuild: JSON.parse(info)});
    }.bind(this));
  },
  getLastFailedBuild: function() {
    api(this.root)['buildInfo'](this.get('name'), this.get('lastFailedBuild').number, function(err, info) {
      this.set({lastFailedBuild: JSON.parse(info)});
    }.bind(this));
  }
});