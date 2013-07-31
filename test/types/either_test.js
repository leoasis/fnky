var curried = require('../../curried');
var Either = require('../../types/either');
var right = Either.right;
var left = Either.left;
var map = require('../../functor').map;
var applicative = require('../../applicative');
var ap = applicative.ap;
var pure = applicative.pure;

describe('Either', function() {

  describe('as functor', function() {
    function inc(n) { return n + 1; }

    it('map inc right(2)', function() {
      expect(map(inc, right(2))).to.eql(right(3));
      expect(right(2).map(inc)).to.eql(right(3));
    });

    it('map inc left("something")', function() {
      expect(map(inc, left(null))).to.eql(left(null));
      expect(left(null).map(inc)).to.eql(left(null));
    });
  });

  describe('as applicative', function() {
    var add = curried(function(a, b) { return a + b; });

    it('pure/of 2', function() {
      expect(pure(2).coerce(Either)).to.eql(right(2));
      expect(Either.of(2)).to.eql(right(2));
    });

    it('ap pure(add) right(2) right(3)', function() {
      expect(ap(pure(add), right(2), right(3))).to.eql(right(5));
      expect(Either.of(add).ap(right(2)).ap(right(3))).to.eql(right(5));
    });

    it('ap pure(add) left("something") right(3)', function() {
      expect(ap(pure(add), left("something"), right(3))).to.eql(left("something"));
      expect(Either.of(add).ap(left("something")).ap(right(3))).to.eql(left("something"));
    });

    it('ap pure(add) right(2) left("something")', function() {
      expect(ap(pure(add), right(2), left("something"))).to.eql(left("something"));
      expect(Either.of(add).ap(right(2)).ap(left("something"))).to.eql(left("something"));
    });

    it('ap left("something") right(2) right(3)', function() {
      expect(ap(left("something"), right(2), right(3))).to.eql(left("something"));
      expect(left("something").ap(right(2)).ap(right(3))).to.eql(left("something"));
    });
  });

  describe('as monad', function() {
    function mayFail(a) { return a > 5 ? left("something") : right(2 * a); }

    it('of 10 chain mayFail', function() {
      expect(Either.of(10).chain(mayFail)).to.eql(left("something"));
    });

    it('of 4 chain mayFail', function() {
      expect(Either.of(4).chain(mayFail)).to.eql(right(8));
    });

    it('right null chain mayFail', function() {
      expect(left("something").chain(mayFail)).to.eql(left("something"));
    });
  });
});