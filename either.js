var monad = require('./monad');
var map = monad.map;
var curried = require('./curried');

function Either(left, right) {
  var x = function(right) {
    return EitherA(left, right);
  };
  x.left = left;
  x.of = EitherA.of; // A little hackish?
  x.prototype = EitherA.prototype;

  return arguments.length === 1 ? x : new x(right);
}

module.exports = Either;

function EitherA(left, right) {
  if (!(this instanceof EitherA)) return new EitherA(left, right);
  this.left = left;
  this.right = right;
}

EitherA.prototype.isLeft = function() {
  return this.right === null || typeof this.right === 'undefined';
};

monad(EitherA, {
  map: function(f) {
    if (this.isLeft())
      return EitherA(this.left, null);
    else
      return EitherA(this.left, f(this.right));
  },
  of: function(value) {
    return EitherA(this.left, value);
  },
  ap: function(other) {
    if (this.isLeft())
      return EitherA(this.left, null);
    else
      return map(this.right, other);
  },
  chain: function(f) {
    if (this.isLeft())
      return EitherA(this.left, null);
    else
      return f(this.right);
  }
});