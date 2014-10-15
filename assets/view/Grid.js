var React = require('react');

module.exports = React.createClass({
  render: function() {
    return this.transferPropsTo(<div className="ui grid">
    {this.props.children}
    </div>);
  }
});