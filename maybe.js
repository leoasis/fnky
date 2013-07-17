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