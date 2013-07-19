var utils = require('./utils');
var curried = require('./curried');
var functor = require('./functor');
var ownFunctionFrom = utils.ownFunctionFrom;

var derivables = {
  map: function(f) {
    return this.constructor.of(f).ap(this);
  }
};

var applicative = function(type, definition) {
  var ofFn = ownFunctionFrom(type, 'of') || ownFunctionFrom(type.prototype, 'of') || ownFunctionFrom(definition, 'of');
  if (!ofFn)
    throw new Error("You need to implement the method `of`");

  var apFn = ownFunctionFrom(type.prototype, 'ap') || ownFunctionFrom(definition, 'ap');
  if (!apFn)
    throw new Error("You need to implement the method `ap`");

  type.of = type.prototype.of = ofFn;
  type.prototype.ap = apFn;


  var newDefinition = {
    map: ownFunctionFrom(definition, 'map') || derivables.map
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