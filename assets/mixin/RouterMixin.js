var React = require('react');
var _ = require('underscore');
var Backbone = require('backbone');

module.exports = {
  componentWillMount: function() {
    var methods = {};
    _.each(this.routes, function(method) {
      methods[method] = _.debounce(this[method], 0);
    }, this);
    var Router = Backbone.Router.extend(_.extend({routes: this.routes}, methods));
    var router = new Router;
    this.setState({ router: router});
    this.navigate = router.navigate;

    if (Backbone.History.started) Backbone.history.stop();
    Backbone.history.start();
  }
}