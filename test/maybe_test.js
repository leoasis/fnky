var curried = require('../curried');
var Maybe = require('../maybe');
var map = require('../functor').map;
var applicative = require('../applicative');
var ap = applicative.ap;
var pure = applicative.pure;

describe('Maybe', function() {
  describe('as functor', function() {
    function inc(n) { return n + 1; }

    it('map inc Maybe(2)', function() {
      expect(map(inc, Maybe(2))).to.eql(Maybe(3));
      expect(Maybe(2).map(inc)).to.eql(Maybe(3));
    });

    it('map inc Maybe(null)', function() {
      expect(map(inc, Maybe(null))).to.eql(Maybe(null));
      expect(Maybe(null).map(inc)).to.eql(Maybe(null));
    });
  });

  describe('as applicative', function() {
    var add = curried(function(a, b) { return a + b; });

    it('pure/of 2', function() {
      expect(pure(2).coerce(Maybe)).to.eql(Maybe(2));
      expect(Maybe.of(2)).to.eql(Maybe(2));
    });

    it('ap pure(add) Maybe(2) Maybe(3)', function() {
      expect(ap(pure(add), Maybe(2), Maybe(3))).to.eql(Maybe(5));
      expect(Maybe.of(add).ap(Maybe(2)).ap(Maybe(3))).to.eql(Maybe(5));
    });

    it('ap pure(add) Maybe(null) Maybe(3)', function() {
      expect(ap(pure(add), Maybe(null), Maybe(3))).to.eql(Maybe(null));
      expect(Maybe.of(add).ap(Maybe(null)).ap(Maybe(3))).to.eql(Maybe(null));
    });

    it('ap pure(add) Maybe(2) Maybe(null)', function() {
      expect(ap(pure(add), Maybe(2), Maybe(null))).to.eql(Maybe(null));
      expect(Maybe.of(add).ap(Maybe(2)).ap(Maybe(null))).to.eql(Maybe(null));
    });

    it('ap pure(null) Maybe(2) Maybe(3)', function() {
      expect(ap(pure(null), Maybe(2), Maybe(3))).to.eql(Maybe(null));
      expect(Maybe.of(null).ap(Maybe(2)).ap(Maybe(3))).to.eql(Maybe(null));
    });
  });

  describe('as monad', function() {
    function mayFail(a) { return a > 5 ? Maybe(null) : Maybe(2 * a); }

    it('of 10 chain mayFail', function() {
      expect(Maybe.of(10).chain(mayFail)).to.eql(Maybe(null));
    });

    it('of 4 chain mayFail', function() {
      expect(Maybe.of(4).chain(mayFail)).to.eql(Maybe(8));
    });

    it('maybe null chain mayFail', function() {
      expect(Maybe(null).chain(mayFail)).to.eql(Maybe(null));
    });
  });
});