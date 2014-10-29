var _ = require('underscore');
function handleEvent(event) {
  var objs = _.filter(this.state, function(state) {
    return state && state._events;
  });
  objs.forEach(function(obj) {
    obj.trigger(event);
  });
}
module.exports = {
  componentWillMount: function() {
    handleEvent.call(this, 'componentWillMount');
  },
  componentDidMount: function() {
    handleEvent.call(this, 'componentDidMount');
  },
  componentWillUnmount: function() {
    handleEvent.call(this, 'componentWillUnmount');
  },
  componentDidUnmount: function() {
    handleEvent.call(this, 'componentDidUnmount');
  },
  componentDidUpdate: function() {
    handleEvent.call(this, 'componentDidUpdate');
  }
};
