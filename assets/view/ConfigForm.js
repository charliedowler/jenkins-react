var React = require('react');
var ErrorMessage = require('./ErrorMessage');

module.exports = React.createClass({
  getInitialState: function () {
    return {
      root: null,
      error: null
    }
  },
  render: function () {
    var error = this.state.error
    error = error ? <ErrorMessage problem={error.problem} solution={error.solution} /> : null;

    return <div id="config-form">
      <div className="ui one column grid">
        <div className="column">
          <div className="ui fluid form segment">
            <h3 className="ui header">Configuration</h3>
            <div className="field">
              <label>Jenkins root url</label>
              <input placeholder="http://example.com" type="text" defaultValue={this.state.root} ref="root" />
              {error}
            </div>
            <div onClick={this.save} className="ui blue submit button">Save</div>
          </div>
        </div>
      </div>
    </div>;
  },
  validate: function () {
    var matcher = /^\w+:\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/;
    return true || matcher.test(this.refs['root'].getDOMNode().value);
  },
  componentDidUpdate: function () {
    if (this.props.onChange && this.state.root) this.props.onChange({ root: this.state.root });
  },
  save: function () {
    if (this.validate()) {
      this.setState({ root: this.refs['root'].getDOMNode().value });
    }
    else {
      this.setState({ error: {
        problem: 'Invalid root url',
        solution: 'Check the docs.'
      }});
    }
  }
});