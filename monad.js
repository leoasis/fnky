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