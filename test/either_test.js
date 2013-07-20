require('should');
var curried = require('../curried');
var Either = require('../either');
var right = Either.right;
var left = Either.left;
var map = require('../functor').map;
var applicative = require('../applicative');
var ap = applicative.ap;
var pure = applicative.pure;

describe('Either', function() {

  describe('as functor', function() {
    function inc(n) { return n + 1; }

    it('map inc right(2)', function() {
      map(inc, right(2)).should.eql(right(3));
      right(2).map(inc).should.eql(right(3));
    });

    it('map inc left("something")', function() {
      map(inc, left(null)).should.eql(left(null));
      left(null).map(inc).should.eql(left(null));
    });
  });

  describe('as applicative', function() {
    var add = curried(function(a, b) { return a + b; });

    it('pure/of 2', function() {
      pure(2).coerce(Either).should.eql(right(2));
      Either.of(2).should.eql(right(2));
    });

    it('ap pure(add) right(2) right(3)', function() {
      ap(pure(add), right(2), right(3)).should.eql(right(5));
      Either.of(add).ap(right(2)).ap(right(3)).should.eql(right(5));
    });

    it('ap pure(add) left("something") right(3)', function() {
      ap(pure(add), left("something"), right(3)).should.eql(left("something"));
      Either.of(add).ap(left("something")).ap(right(3)).should.eql(left("something"));
    });

    it('ap pure(add) right(2) left("something")', function() {
      ap(pure(add), right(2), left("something")).should.eql(left("something"));
      Either.of(add).ap(right(2)).ap(left("something")).should.eql(left("something"));
    });

    it('ap left("something") right(2) right(3)', function() {
      ap(left("something"), right(2), right(3)).should.eql(left("something"));
      left("something").ap(right(2)).ap(right(3)).should.eql(left("something"));
    });
  });

  describe('as monad', function() {
    function mayFail(a) { return a > 5 ? left("something") : right(2 * a); }

    it('of 10 chain mayFail', function() {
      Either.of(10).chain(mayFail).should.eql(left("something"));
    });

    it('of 4 chain mayFail', function() {
      Either.of(4).chain(mayFail).should.eql(right(8));
    });

    it('right null chain mayFail', function() {
      left("something").chain(mayFail).should.eql(left("something"));
    });
  });
});