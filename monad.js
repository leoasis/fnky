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