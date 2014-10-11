var React = require('react');

module.exports = React.createClass({
  render: function () {
    return <div className="ui inverted menu">
      <a className="active item">
        <i className="home icon"></i>
      Home </a>
      <a className="item">
        <i className="mail icon"></i>
      Messages </a>
      <div className="right menu">
        <div className="item">
          <div className="ui icon input">
            <input type="text" placeholder="Search..." />
            <i className="search link icon"></i>
          </div>
        </div>
        <a className="item" href="#" onClick={this.logout}>
          <i className="sign out icon"></i>
        </a>
      </div>
    </div>;
  },
  logout: function() {
    if (Storage) {
      delete localStorage.user;
      delete localStorage.pass;
    }
    window.location.reload();
  }
});

