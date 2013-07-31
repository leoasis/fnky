var monoid = require('../monoid');

var Sum = function(n) {
  if (!(this instanceof Sum)) return new Sum(n);
  this.n = n;
};

monoid(Sum, {
  empty: function() { return Sum(0); },
  concat: function(other) { return Sum(this.n + other.n); }
});

module.exports = Sum;