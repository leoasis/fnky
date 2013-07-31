var monoid = require('../../monoid');
var concat = monoid.concat;
var Product = require('../../types/product');

describe('Product', function() {
  describe('as monoid', function() {
    it('empty', function() {
      expect(Product.empty()).to.eql(Product(1));
    });

    it('Product 1 concat Product 3 concat Product 6', function() {
      expect(concat(Product(1), Product(3), Product(6))).to.eql(Product(18));
      expect(Product(1).concat(Product(3)).concat(Product(6))).to.eql(Product(18));
    });
  });
});