var applicative = require('../applicative');

applicative(Function, {
  of: function(value) {
    return function() { return value; };
  },
  ap: function(other) {
    var self = this;
    return function(value) {
      return self(value)(other(value));
    };
  }
});

module.exports = Function;