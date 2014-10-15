(function () {
  'use strict';
  // Thanks underscore
  var debounce = function (func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function () {
      var last = Date.now() - timestamp;

      if (last < wait && last > 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function () {
      context = this;
      args = arguments;
      timestamp = Date.now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  /**
   * StateMixin - Fixes issues with the state being set inside REST
   * callbacks that aren't notified of the component being unmounted.
   *
   * Setting a debounce on your component will slow down the amount
   * of console.warn messages coming from this mixin.
   */
  var StateMixin = {
    componentWillMount: function () {
      var delay = this.debounce;
      var warn = debounce(function (msg) {
        console.warn(msg)
      }, !isNaN(delay) ? delay : 0);

      var originalMethod = this['setState'];
      this['setState'] = function () {
        if (this.isMounted()) {
          originalMethod.apply(this, arguments);
        }
        else {
          warn('Caught error: Invariant Violation: replaceState(...): Can only update a mounted or mounting component.');
        }
      }.bind(this);
    }
  };
  if (typeof module !== 'undefined' && 'exports' in module) {
    module.exports = StateMixin;
  }
  else if (typeof define !== 'undefined') {
    define(function (require, exports, module) {
      module.exports = StateMixin;
    }, []);
  }
  else if (typeof window !== 'undefined') {
    window.StateMixin = StateMixin;
  }
})();