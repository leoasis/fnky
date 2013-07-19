require('should');
var monoid = require('../monoid');
var concat = monoid.concat;
var Sum = monoid.Sum;
var Product = monoid.Product;

describe('monoid', function() {
  describe('definition', function() {
    it('throws if empty not defined', function() {
      (function() {
        function Monoid(){}
        monoid(Monoid, {
          concat: function() {}
        });
      }).should.throwError("You need to implement the method `empty`");
    });

    it('throws if concat not defined', function() {
      (function() {
        function Monoid(){}
        monoid(Monoid, {
          empty: function() {}
        });
      }).should.throwError("You need to implement the method `concat`");
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
        Monoid.prototype.concat.should.equal(concat);
      });

      it('puts the `empty` function in the monoid constructor', function() {
        Monoid.empty.should.equal(empty);
      });

      it('puts the `empty` function in the monoid prototype', function() {
        Monoid.prototype.empty.should.equal(empty);
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
        Monoid.empty.should.equal(empty);
      });
    });
  });

  describe('instances', function() {
    describe('Array instance', function() {
      it('empty', function() {
        Array.empty().should.eql([]);
      });

      it('[1, 2, 3] concat [4, 5, 6] concat [7, 8, 9]', function() {
        concat([1, 2, 3], [4, 5, 6], [7, 8, 9]).should.eql([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        [1, 2, 3].concat([4, 5, 6]).concat([7, 8, 9]).should.eql([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      });
    });

    describe('Sum instance', function() {
      it('empty', function() {
        Sum.empty().should.eql(Sum(0));
      });

      it('Sum 1 concat Sum 3 concat Sum 6', function() {
        concat(Sum(1), Sum(3), Sum(6)).should.eql(Sum(10));
        Sum(1).concat(Sum(3)).concat(Sum(6)).should.eql(Sum(10));
      });
    });

    describe('Product instance', function() {
      it('empty', function() {
        Product.empty().should.eql(Product(1));
      });

      it('Product 1 concat Product 3 concat Product 6', function() {
        concat(Product(1), Product(3), Product(6)).should.eql(Product(18));
        Product(1).concat(Product(3)).concat(Product(6)).should.eql(Product(18));
      });
    });
  });
});