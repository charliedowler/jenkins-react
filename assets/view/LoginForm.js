var React = require('react');
var APIMixin = require('../mixin/APIMixin');

var component = React.createClass({
  mixins: [APIMixin],
  getInitialState: function() {
    return {
      registrationEnabled: true
    };
  },
  componentDidMount: function() {
    this.execute('isRegistrationEnabled', function(err, isEnabled) {
      this.setState({ registrationEnabled: isEnabled });
    }.bind(this));
  },
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
        this.props.onLoggedIn && this.props.onLoggedIn(username, password);
      }
    }.bind(this));
  },
  render: function() {
    var disabled = !this.state.registrationEnabled ? 'disabled' : '';

    return <div id="config-form">
      <div className="ui two column grid">
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
        <div className="column">
          <div className="ui fluid form segment">
            <h3 className="ui header">Register</h3>
            <div className="two fields">
              <div className="field">
                <label>First Name</label>
                <input placeholder="First Name" type="text" disabled={disabled} />
              </div>
              <div className="field">
                <label>Last Name</label>
                <input placeholder="Last Name" type="text" disabled={disabled} />
              </div>
            </div>
            <div className="field">
              <label>Username</label>
              <input placeholder="Username" type="text" disabled={disabled} />
            </div>
            <div className="field">
              <label>Password</label>
              <input type="password" disabled={disabled} />
            </div>
            <div className="inline field">
              <div className="ui checkbox">
                <input type="checkbox" disabled={disabled} id="conditions" />
                <label htmlFor="conditions">I agree to the terms and conditions</label>
              </div>
            </div>
            <div className={"ui blue submit " + disabled +" button"}>Submit</div>
          </div>
        </div>
      </div>
    </div>;
  }
});

module.exports = component;
