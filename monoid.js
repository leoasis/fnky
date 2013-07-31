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

// Any, All
// Ordering

// Maybe(monoid)
// First Maybe
// Last Maybe