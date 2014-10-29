var Backbone = require('backbone');
var Job = require('../model/Job');
var _ = require('underscore');
var FetchMixin = require('../mixin/FetchMixin');

module.exports = Backbone.Collection.extend({
  model: Job,
  url: 'http://localhost:3000/all_jobs',
  initialize: function() {
    FetchMixin.call(this);
    this.on('componentWillUnmount', this.abort, this);
  },
  abort: _.debounce(function() {
    this.fetched.abort();
    this.models.forEach(function(model) {
      model.abort();
    });
  }, 0)
});
