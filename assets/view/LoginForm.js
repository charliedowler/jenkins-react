var React = require('react');
var APIMixin = require('../mixin/APIMixin');

var component = React.createClass({
  mixins: [APIMixin],
  login: function() {
    var username = this.refs.username.getDOMNode().value;
    var password = this.refs.password.getDOMNode().value;

    this.execute('login', username, password, function(err, response) {
      if (err) throw new Error(err);
      if (response.statusCode < 300) {
        if (Storage) {
          localStorage.user = username;
          localStorage.pass = password;
        }
        if (this.props.onLoggedIn) {
          this.props.onLoggedIn(username, password);
        }
      }
    }.bind(this));
  },
  render: function() {
    return <div id="config-form">
      <div className="ui one column grid">
        <div className="column">
          <div className="ui fluid form segment">
            <h3 className="ui header">Log-in</h3>
            <div className="field">
              <label>Username</label>
              <input placeholder="Username" ref="username" type="text" />
            </div>
            <div className="field">
              <label>Password</label>
              <input type="password" ref="password" />
            </div>
            <div onClick={this.login} className="ui blue submit button">Login</div>
          </div>
        </div>
      </div>
    </div>;
  }
});

module.exports = component;
