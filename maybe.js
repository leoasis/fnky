var functor = require('./functor');
var map = functor.map;
var applicative = require('./applicative');

function Maybe(val) {
  if (!(this instanceof Maybe))
    return new Maybe(val);

  this.val = val;
}

Maybe.prototype.isNothing = function() {
  return this.val === null || typeof this.val === "undefined";
};

functor(Maybe, {
  map: function(f) {
    return this.isNothing() ? Maybe(null) : Maybe(f(this.val));
  }
});

applicative(Maybe, {
  of: function(val) { return Maybe(val); },
  ap: function(a) {
    return this.isNothing() ? Maybe(null) : map(this.val, a);
  }
});

module.exports = Maybe;