var curried = require('./curried');

var derivables = {
  map: function(f) {
    return this.of(f).ap(this);
  }
};

var applicative = function(type, definition) {
  type.of = definition.of;
  if (typeof type.prototype.map != "function")
    type.prototype.map = derivables.map;
  type.prototype.of = definition.of;
  type.prototype.ap = definition.ap;
  type.prototype.coerce = function() {
    return this;
  };
};

function ap() {
  var aps = Array.prototype.slice.call(arguments);
  return aps.reduce(function(acc, ap) {
    // Guess the pure type from the second applicative
    acc = acc.coerce(ap.constructor);
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

Pure.prototype.coerce = function(other) {
  return other.of(this.val);
};

applicative.ap = curried(2, ap);
applicative.pure = pure;
module.exports = applicative;

applicative(Array, {
  of: function(value) {
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