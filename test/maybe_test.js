require('should');
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
      map(inc, Maybe(2)).should.eql(Maybe(3));
      Maybe(2).map(inc).should.eql(Maybe(3));
    });

    it('map inc Maybe(null)', function() {
      map(inc, Maybe(null)).should.eql(Maybe(null));
      Maybe(null).map(inc).should.eql(Maybe(null));
    });
  });

  describe('as applicative', function() {
    var add = curried(function(a, b) { return a + b; });

    it('pure/of 2', function() {
      pure(2).coerce(Maybe).should.eql(Maybe(2));
      Maybe.of(2).should.eql(Maybe(2));
    });

    it('ap pure(add) Maybe(2) Maybe(3)', function() {
      ap(pure(add), Maybe(2), Maybe(3)).should.eql(Maybe(5));
      Maybe.of(add).ap(Maybe(2)).ap(Maybe(3)).should.eql(Maybe(5));
    });

    it('ap pure(add) Maybe(null) Maybe(3)', function() {
      ap(pure(add), Maybe(null), Maybe(3)).should.eql(Maybe(null));
      Maybe.of(add).ap(Maybe(null)).ap(Maybe(3)).should.eql(Maybe(null));
    });

    it('ap pure(add) Maybe(2) Maybe(null)', function() {
      ap(pure(add), Maybe(2), Maybe(null)).should.eql(Maybe(null));
      Maybe.of(add).ap(Maybe(2)).ap(Maybe(null)).should.eql(Maybe(null));
    });

    it('ap pure(null) Maybe(2) Maybe(3)', function() {
      ap(pure(null), Maybe(2), Maybe(3)).should.eql(Maybe(null));
      Maybe.of(null).ap(Maybe(2)).ap(Maybe(3)).should.eql(Maybe(null));
    });
  });
});