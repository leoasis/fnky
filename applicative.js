var curried = require('./curried');

var applicative = function(type, definition) {
  type.prototype.pure = definition.pure;
  type.prototype.ap = definition.ap;
  type.prototype.coerce = function() {
    return this;
  };
};

function ap() {
  var aps = Array.prototype.slice.call(arguments);
  return aps.reduce(function(acc, ap) {
    // Guess the pure type from the second applicative
    acc = acc.coerce(ap);
    return acc.ap(ap);
  });
}

function pure(val) {
  return Pure(val);
}

function Pure(val) {
  if (!(this instanceof Pure)) return new Pure(val);
  this.val = val;
}

Pure.prototype = {
  coerce: function(other) {
    return other.pure(this.val);
  }
};

applicative.ap = curried(2, ap);
applicative.pure = pure;
module.exports = applicative;

applicative(Array, {
  pure: function(value) {
    return [value];
  },
  ap: function(other) {
    var ret = [];
    this.forEach(function(f) {
      other.forEach(function(x) {
        ret.push(f(x));
      });
    });
    return ret;
  }
});