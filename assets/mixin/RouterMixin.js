var React = require('react');
var _ = require('underscore');
var Backbone = require('backbone');

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
}