var functor = require('./functor');
var fmap = functor.fmap;
var applicative = require('./applicative');

var Maybe = function(val) {
  if (!(this instanceof Maybe))
    return new Maybe(val);

  this.val = val;
};

Maybe.prototype = {
  isNothing: function() {
    return this.val === null || typeof this.val === "undefined";
  }
};

functor(Maybe, {
  fmap: function(f) {
    return this.isNothing() ? Maybe(null) : Maybe(f(this.val));
  }
});

applicative(Maybe, {
  pure: function(val) { return Maybe(val); },
  ap: function(a) {
    return this.isNothing() ? Maybe(null) : fmap(this.val, a);
  }
});

module.exports = Maybe;