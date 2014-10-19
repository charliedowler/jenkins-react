var React = require('react');
var _ = require('underscore');
var Backbone = require('backbone');

// Workaround for removing Backbone jQuery dependency
require('backbone.nativeajax');
Backbone.$ = function() {
  return {
    on: function() {},
    off: function() {}
  }
};

module.exports = {
  componentWillMount: function() {
    var properties = {
      routes: this.routes
    };
    _.each(properties.routes, function(method) {
      properties[method] = this[method];
    }, this);
    var Router = Backbone.Router.extend(properties);
    this.setState({ router: new Router});
  }
};