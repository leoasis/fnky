require('../../types/array');
var curried = require('../../curried');
var monad = require('../../monad');
var functor = require('../../functor');
var applicative = require('../../applicative');
var map = functor.map;
var pure = monad.pure;
var ap = applicative.ap;
var monoid = require('../../monoid');
var concat = monoid.concat;

describe("Array", function() {
  describe("as functor", function() {
    function inc(n) { return n + 1; }

    it('map inc [1, 2, 3]', function() {
      expect(map(inc, [1, 2, 3])).to.eql([2, 3, 4]);
      expect([1, 2, 3].map(inc)).to.eql([2, 3, 4]);
    });

    it('map inc []', function() {
      expect(map(inc, [])).to.eql([]);
      expect([].map(inc)).to.eql([]);
    });
  });

  describe("as applicative", function() {
    var add = curried(function(a, b) { return a + b; });

    it('pure/of 1', function() {
      expect(pure(1).coerce(Array)).to.eql([1]);
      expect(Array.of(1)).to.eql([1]);
      expect([].of(1)).to.eql([1]);
    });

    it('ap pure(add) [1, 2] [3, 4]', function() {
      expect(ap(pure(add), [1, 2], [3, 4])).to.eql([4, 5, 5, 6]);
      expect(Array.of(add).ap([1, 2]).ap([3, 4])).to.eql([4, 5, 5, 6]);
      //expect([1, 2].map(add).ap([3, 4])).to.eql([4, 5, 5, 6]);
    });
  });

  describe("as monad", function() {
    function plusMinus(n) { return [n, -n]; }

    it('pure n chain plusMinus', function() {
      expect(pure(2).coerce(Array).chain(plusMinus)).to.eql([2, -2]);
      expect(Array.of(2).chain(plusMinus)).to.eql([2, -2]);
    });

    it('array chain plusMinus', function() {
      expect([1, 2, 3].chain(plusMinus)).to.eql([1, -1, 2, -2, 3, -3]);
    });
  });

  describe("as monoid", function() {
    it('empty', function() {
      expect(Array.empty()).to.eql([]);
    });

    it('[1, 2, 3] concat [4, 5, 6] concat [7, 8, 9]', function() {
      expect(concat([1, 2, 3], [4, 5, 6], [7, 8, 9])).to.eql([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      expect([1, 2, 3].concat([4, 5, 6]).concat([7, 8, 9])).to.eql([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });
  });
});