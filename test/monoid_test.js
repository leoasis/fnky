var monoid = require('../monoid');
var concat = monoid.concat;
var Sum = monoid.Sum;
var Product = monoid.Product;

describe('monoid', function() {
  describe('definition', function() {
    it('throws if empty not defined', function() {
      expect(function() {
        function Monoid(){}
        monoid(Monoid, {
          concat: function() {}
        });
      }).to.throw("You need to implement the method `empty`");
    });

    it('throws if concat not defined', function() {
      expect(function() {
        function Monoid(){}
        monoid(Monoid, {
          empty: function() {}
        });
      }).to.throw("You need to implement the method `concat`");
    });

    describe('when fully constructed', function() {
      var Monoid, concat, empty;

      beforeEach(function() {
        Monoid = function() {};
        concat = function() {};
        empty = function() {};

        monoid(Monoid, {
          concat: concat,
          empty: empty
        });
      });

      it('puts the `concat` function in the monoid prototype', function() {
        expect(Monoid.prototype.concat).to.equal(concat);
      });

      it('puts the `empty` function in the monoid constructor', function() {
        expect(Monoid.empty).to.equal(empty);
      });

      it('puts the `empty` function in the monoid prototype', function() {
        expect(Monoid.prototype.empty).to.equal(empty);
      });
    });

    describe('with functions previously defined', function() {
      var Monoid, empty;

      beforeEach(function() {
        Monoid = function() {};
        empty = function() {};

        Monoid.empty = empty;

        monoid(Monoid, {
          concat: function() {}
        });
      });

      it('preserves `empty` if previously defined', function() {
        expect(Monoid.empty).to.equal(empty);
      });
    });
  });

  describe('instances', function() {
    describe('Array instance', function() {
      it('empty', function() {
        expect(Array.empty()).to.eql([]);
      });

      it('[1, 2, 3] concat [4, 5, 6] concat [7, 8, 9]', function() {
        expect(concat([1, 2, 3], [4, 5, 6], [7, 8, 9])).to.eql([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        expect([1, 2, 3].concat([4, 5, 6]).concat([7, 8, 9])).to.eql([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      });
    });

    describe('Sum instance', function() {
      it('empty', function() {
        expect(Sum.empty()).to.eql(Sum(0));
      });

      it('Sum 1 concat Sum 3 concat Sum 6', function() {
        expect(concat(Sum(1), Sum(3), Sum(6))).to.eql(Sum(10));
        expect(Sum(1).concat(Sum(3)).concat(Sum(6))).to.eql(Sum(10));
      });
    });

    describe('Product instance', function() {
      it('empty', function() {
        expect(Product.empty()).to.eql(Product(1));
      });

      it('Product 1 concat Product 3 concat Product 6', function() {
        expect(concat(Product(1), Product(3), Product(6))).to.eql(Product(18));
        expect(Product(1).concat(Product(3)).concat(Product(6))).to.eql(Product(18));
      });
    });
  });
});