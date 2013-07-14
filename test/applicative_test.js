require('should');
var curried = require('../curried');
var applicative = require('../applicative');
var ap = applicative.ap;
var pure = applicative.pure;

describe('applicative', function() {
  describe('instances', function() {
    var add = curried(function(a, b) { return a + b; });

    describe('Array applicative', function() {
      it('pure/of 1', function() {
        pure(1).coerce(Array).should.eql([1]);
        Array.of(1).should.eql([1]);
        [].of(1).should.eql([1]);
      });

      it('ap pure(add) [1, 2] [3, 4]', function() {
        ap(pure(add), [1, 2], [3, 4]).should.eql([4, 5, 5, 6]);
        Array.of(add).ap([1, 2]).ap([3, 4]).should.eql([4, 5, 5, 6]);
        //[1, 2].map(add).ap([3, 4]).should.eql([4, 5, 5, 6]);
      });
    });

    describe('Function applicative', function() {
      it('pure/of 1', function() {
        pure(1).coerce(Function)("whatever").should.eql(1);
        Function.of(1)("whatever").should.eql(1);
        (function() {}).of(1)("whatever").should.eql(1);
      });

      function plus3(n) { return n + 3; }
      function by5(n) { return n * 5; }

      it('ap pure(add) plus3 by5', function() {
        ap(pure(add), plus3, by5)(3).should.eql(21);
        Function.of(add).ap(plus3).ap(by5)(3).should.eql(21);
      });
    });
  });
});