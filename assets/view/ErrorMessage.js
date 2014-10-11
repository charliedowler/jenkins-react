var React = require('react');

module.exports = React.createClass({
  render: function () {
    return <div className="ui red message">
      <div className="header">
      {this.props.problem}
      </div>
      <p>{this.props.solution}</p>
    </div>;
  }
});