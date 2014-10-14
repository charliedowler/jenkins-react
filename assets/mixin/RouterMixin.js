var React = require('react');
var _ = require('underscore');
var Backbone = require('backbone');

module.exports = {
  componentDidMount: function() {
    var methods = {};
    _.each(this.routes, function(method) {
      methods[method] = this[method];
    }, this);
    var Router = Backbone.Router.extend(_.extend({routes: this.routes}, methods));
    var router = new Router;
    this.setState({ router: router});
    this.navigate = router.navigate;
    Backbone.history.start({ pushState: true });
  },
  componentDidUpdate: function() {

  }
};