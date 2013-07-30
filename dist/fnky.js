(function(e){if("function"==typeof bootstrap)bootstrap("fnky",e);else if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else if("undefined"!=typeof ses){if(!ses.ok())return;ses.makeFnky=e}else"undefined"!=typeof window?window.fnky=e():global.fnky=e()})(function(){var define,ses,bootstrap,module,exports;
return (function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
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
  utils.check(ofFn, 'notImplemented', 'of');

  var apFn = ownFunctionFrom(type.prototype, 'ap') || ownFunctionFrom(definition, 'ap');
  utils.check(apFn, 'notImplemented', 'ap');

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
},{"./curried":2,"./functor":4,"./utils":9}],2:[function(require,module,exports){
module.exports = function(length, f) {
  if (arguments.length === 1) {
    f = length;
    length = f.length;
  }
  return partiallyApply(f, length, []);
};

function partiallyApply(f, length, args) {
  if (args.length >= length) {
    return f.apply(null, args);
  } else {
    return function() {
      var newArgs = args.concat(Array.prototype.slice.call(arguments));
      return partiallyApply(f, length, newArgs);
    };
  }
}
},{}],3:[function(require,module,exports){
var monad = require('./monad');
var map = monad.map;
var curried = require('./curried');

function Either(left, right) {
  if (!(this instanceof Either)) return new Either(left, right);
  this.left = left;
  this.right = right;
}
Either.right = function(right) {
  return new Either(null, right);
};

Either.left = function(left) {
  return new Either(left, null);
};

module.exports = Either;

Either.prototype.isLeft = function() {
  return this.right === null || typeof this.right === 'undefined';
};

monad(Either, {
  map: function(f) {
    if (this.isLeft())
      return Either.left(this.left);
    else
      return Either.right(f(this.right));
  },
  of: function(value) {
    return Either.right(value);
  },
  ap: function(other) {
    if (this.isLeft())
      return Either.left(this.left);
    else
      return map(this.right, other);
  },
  chain: function(f) {
    if (this.isLeft())
      return Either.left(this.left);
    else
      return f(this.right);
  }
});
},{"./curried":2,"./monad":7}],4:[function(require,module,exports){
var utils = require('./utils');
var curried = require('./curried');
var hasProperty = utils.hasProperty;
var ownFunctionFrom = utils.ownFunctionFrom;

var functor = function(type, definition) {
  var mapFn = ownFunctionFrom(type.prototype, 'map') || ownFunctionFrom(definition, 'map');
  utils.check(mapFn, 'notImplemented', 'map');

  type.prototype.map = mapFn;
};

var map = function(f, functor) {
  return functor.map(f);
};

functor.map = curried(map);

module.exports = functor;

functor(Object, {
  map: function(f) {
    var mapped = {};
    for (var key in this) {
      if (hasProperty(this, key))
        mapped[key] = f(this[key]);
    }
    return mapped;
  }
});

functor(Function, {
  map: function(f) {
    var self = this;
    return function(x) {
      return f(self(x));
    };
  }
});
},{"./curried":2,"./utils":9}],5:[function(require,module,exports){
var fnky = {
  functor: require('./functor'),
  applicative: require('./applicative'),
  monad: require('./monad'),
  monoid: require('./monoid'),
  curried: require('./curried'),
  maybe: require('./maybe'),
  either: require('./either')
};

module.exports = fnky;
},{"./applicative":1,"./curried":2,"./either":3,"./functor":4,"./maybe":6,"./monad":7,"./monoid":8}],6:[function(require,module,exports){
var monad = require('./monad');
var map = monad.map;

function Maybe(val) {
  if (!(this instanceof Maybe))
    return new Maybe(val);

  this.val = val;
}

Maybe.prototype.isNothing = function() {
  return this.val === null || typeof this.val === "undefined";
};

monad(Maybe, {
  map: function(f) {
    return this.isNothing() ? Maybe(null) : Maybe(f(this.val));
  },
  of: function(val) { return Maybe(val); },
  ap: function(a) {
    return this.isNothing() ? Maybe(null) : map(this.val, a);
  },
  chain: function(f) {
    return this.isNothing() ? Maybe(null) : f(this.val);
  }
});

module.exports = Maybe;
},{"./monad":7}],7:[function(require,module,exports){
var utils = require('./utils');
var applicative = require('./applicative');
var ownFunctionFrom = utils.ownFunctionFrom;

var derivables = {
  map: function(f) {
    var m = this;
    return m.chain(function(a) { return m.constructor.of(f(a)); });
  },
  ap: function(other) {
    return this.chain(function(f) { return other.map(f); });
  }
};

function monad(type, definition) {
  var chainFn = ownFunctionFrom(type.prototype, 'chain') || ownFunctionFrom(definition, 'chain');
  utils.check(chainFn, 'notImplemented', 'chain');

  type.prototype.chain = chainFn;

  var newDefinition = {
    of: definition.of,
    map: ownFunctionFrom(definition, 'map') || derivables.map,
    ap: ownFunctionFrom(definition, 'ap') || derivables.ap
  };

  applicative(type, newDefinition);
}

function compose() {
  var chains = Array.prototype.slice.call(arguments);
  return function(monad) {
    for (var i = chains.length - 1; i >= 0; i--) {
      monad = monad.chain(chains[i]);
    }
    return monad;
  };
}

monad.map = applicative.map;
monad.ap = applicative.ap;
monad.pure = applicative.pure;
monad.compose = compose;
module.exports = monad;

monad(Array, {
  chain: function(f) {
    return this.map(function(x) { return f(x); })
        .reduce(function(list, x) { return list.concat(x); }, []);
  }
});
},{"./applicative":1,"./utils":9}],8:[function(require,module,exports){
var utils = require('./utils');
var curried = require('./curried');
var ownFunctionFrom = utils.ownFunctionFrom;

function monoid(type, definition) {
  var emptyFn = ownFunctionFrom(type, 'empty') || ownFunctionFrom(type.prototype, 'empty') || ownFunctionFrom(definition, 'empty');
  utils.check(emptyFn, 'notImplemented', 'empty');

  var concatFn = ownFunctionFrom(type.prototype, 'concat') || ownFunctionFrom(definition, 'concat');
  utils.check(concatFn, 'notImplemented', 'concat');

  type.empty = type.prototype.empty = emptyFn;
  type.prototype.concat = concatFn;
}

monoid.concat = curried(2, function() {
  var monoids = Array.prototype.slice.call(arguments);
  return monoids.reduce(function(acc, monoid) {
    return acc.concat(monoid);
  });
});

module.exports = monoid;

// Array
/////////////////////////////////////////////////////
monoid(Array, {
  empty: function() { return []; }
  // concat: already defined in Array
});

// Sum
/////////////////////////////////////////////////////
var Sum = monoid.Sum = function(n) {
  if (!(this instanceof Sum)) return new Sum(n);
  this.n = n;
};

monoid(Sum, {
  empty: function() { return Sum(0); },
  concat: function(other) { return Sum(this.n + other.n); }
});

// Product
/////////////////////////////////////////////////////
var Product = monoid.Product = function(n) {
  if (!(this instanceof Product)) return new Product(n);
  this.n = n;
};

monoid(Product, {
  empty: function() { return Product(1); },
  concat: function(other) { return Product(this.n * other.n); }
});

// Any, All
// Ordering

// Maybe(monoid)
// First Maybe
// Last Maybe
},{"./curried":2,"./utils":9}],9:[function(require,module,exports){
var hasProperty = exports.hasProperty = function(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
};

exports.ownPropFrom = function(obj, prop) {
  return hasProperty(obj, prop) ? obj[prop] : null;
};

var isFunction = exports.isFunction = function(f) {
  return typeof f === "function";
};

var isOwnFunction = exports.isOwnFunction = function(obj, prop) {
  return hasProperty(obj, prop) && isFunction(obj[prop]);
};

exports.ownFunctionFrom = function(obj, prop) {
  return isOwnFunction(obj, prop) ? obj[prop] : null;
};

var messages = {
  notImplemented: function(method) {
    throw new Error("You need to implement the method `" + method + "`");
  }
};

exports.check = function(what, message, arg) {
  if (!what) messages[message](arg);
};
},{}]},{},[5])(5)
});
;