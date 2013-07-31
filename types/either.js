var monad = require('../monad');
var map = monad.map;
var curried = require('../curried');

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
  of: function(value) {
    return Either.right(value);
  },
  chain: function(f) {
    if (this.isLeft())
      return Either.left(this.left);
    else
      return f(this.right);
  }
});