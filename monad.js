var utils = require('./utils');
var applicative = require('./applicative');
var ownPropFrom = utils.ownPropFrom;
var isOwnFunction = utils.isOwnFunction;

var derivables = {
  map: function(f) {
    var m = this;
    return m.chain(function(a) { return m.of(f(a)); });
  },
  ap: function(other) {
    return this.chain(function(f) { return other.map(f); });
  }
};

function monad(type, definition) {
  if (!isOwnFunction(definition, 'chain'))
    throw new Error("You need to implement the method `chain`");
  type.prototype.chain = definition.chain;

  var newDefinition = {
    of: definition.of,
    map: ownPropFrom(definition, 'map') || derivables.map,
    ap: ownPropFrom(definition, 'ap') || derivables.ap
  };

  applicative(type, newDefinition);
}

monad.map = applicative.map;
monad.ap = applicative.ap;
monad.pure = applicative.pure;
module.exports = monad;

monad(Array, {
  chain: function(f) {
    return this.map(function(x) { return f(x); })
        .reduce(function(list, x) { return list.concat(x); }, []);
  }
});