var utils = require('./utils');
var curried = require('./curried');
var functor = require('./functor');
var ownPropFrom = utils.ownPropFrom;
var isOwnFunction = utils.isOwnFunction;

var derivables = {
  map: function(f) {
    return this.constructor.of(f).ap(this);
  }
};

var applicative = function(type, definition) {
  if (!isOwnFunction(type, 'of')) {
    if (!isOwnFunction(definition, 'of'))
      throw new Error("You need to implement the method `of`");

    type.of = definition.of;
  }
  if (!isOwnFunction(type.prototype, 'ap')) {
    if (!isOwnFunction(definition, 'ap'))
      throw new Error("You need to implement the method `ap`");

    type.prototype.ap = definition.ap;
  }

  var newDefinition = {
    map: ownPropFrom(definition, 'map') || derivables.map
  };

  type.prototype.coerce = function() {
    return this;
  };

  functor(type, newDefinition);

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

applicative.map = functor.map;
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