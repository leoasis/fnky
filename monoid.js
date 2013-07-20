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