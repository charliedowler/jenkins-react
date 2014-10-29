module.exports = function() {
  var fetch = this.fetch;
  this.fetch = function() {
    this.fetched = fetch.apply(this, arguments);
    return this.fetched;
  }.bind(this);
};
