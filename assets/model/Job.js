var Backbone = require('backbone');
var api = require('../api');
var _ = require('underscore');
var FetchMixin = require('../mixin/FetchMixin');

module.exports = Backbone.Model.extend({
  url: function () {
    return 'http://localhost:3000/job_info?job=' + this.get('name');
  },
  initialize: function () {
    FetchMixin.call(this);
    this.fetch({
      success: this.handleFetch.bind(this)
    });
  },
  handleFetch: function(attrs) {
    var self = this;
    var parsed = attrs.toJSON();
    var name = self.get('name');
    var recents = ['lastBuild', 'lastSuccessfulBuild', 'lastFailedBuild'];

    recents.forEach(function(recent) {
      var number = parsed[recent] && parsed[recent].number;
      if (!number) return false;
      api(self.collection.root).buildInfo(name, number, function(err, info) {
        var toSet = {};
        toSet[recent] = JSON.parse(info);
        self.set(toSet);
      });

    });
  },
  abort: function() {
    this.fetched.abort();
    api.abort();
  }
});
