var api = require('../api');

module.exports = {
  execute: function(task) {
    var args = Array.prototype.slice.call(arguments);
    return api(this.props.root
      , this._rootNodeID)[task].apply(this, args.slice(1));
  },
  abort: function() {
    api.abort(this._rootNodeID);
  }
};
