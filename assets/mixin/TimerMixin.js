module.exports = {
  clearInterval: function() {
    this.ticks = 0;
    if (this.interval) {
      clearInterval(this.interval);
    }
  },
  loadMixin: function() {
    this.clearInterval();
    this.interval = this.ticker ? setInterval(this.ticker, 1500) : null;
  },
  componentWillMount: function() {
    this.loadMixin();
  },
  componentWillUnmount: function() {
    this.clearInterval();
  }
};
