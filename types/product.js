var monoid = require('../monoid');

var Product = function(n) {
  if (!(this instanceof Product)) return new Product(n);
  this.n = n;
};

monoid(Product, {
  empty: function() { return Product(1); },
  concat: function(other) { return Product(this.n * other.n); }
});

module.exports = Product;