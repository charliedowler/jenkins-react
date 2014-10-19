var api = require('../api');

module.exports = {
  execute: function(task) {
    var args = Array.prototype.slice.call(arguments);
    return api(this.props.root)[task].apply(this, args.slice(1));
  }
};
