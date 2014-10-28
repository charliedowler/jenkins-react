var React = require('react');
var Grid = require('./Grid');
var BuildQueue = require('./BuildQueue');
var JobTable = require('./JobTable');

module.exports = React.createClass({
  render: function() {
    return <Grid id="app-grid">
      <div className="three wide column">
        <BuildQueue root={this.props.root} />
      </div>
      <div className="thirteen wide column">
        <JobTable root={this.props.root} />
      </div>
    </Grid>;
  }
});
