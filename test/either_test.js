require('should');
var curried = require('../curried');
var Either = require('../either');
var map = require('../functor').map;
var applicative = require('../applicative');
var ap = applicative.ap;
var pure = applicative.pure;

describe('Either("default")', function() {
  var either;

  beforeEach(function() {
    either = Either('default');
  });

  describe('as functor', function() {
    function inc(n) { return n + 1; }

    it('map inc either(2)', function() {
      map(inc, either(2)).should.eql(either(3));
      either(2).map(inc).should.eql(either(3));
    });

    it('map inc either(null)', function() {
      map(inc, either(null)).should.eql(either(null));
      either(null).map(inc).should.eql(either(null));
    });
  });

  describe('as applicative', function() {
    var add = curried(function(a, b) { return a + b; });

    it('pure/of 2', function() {
      pure(2).coerce(either).should.eql(either(2));
      either.of(2).should.eql(either(2));
    });

    it('ap pure(add) either(2) either(3)', function() {
      ap(pure(add), either(2), either(3)).should.eql(either(5));
      either.of(add).ap(either(2)).ap(either(3)).should.eql(either(5));
    });

    it('ap pure(add) either(null) either(3)', function() {
      ap(pure(add), either(null), either(3)).should.eql(either(null));
      either.of(add).ap(either(null)).ap(either(3)).should.eql(either(null));
    });

    it('ap pure(add) either(2) either(null)', function() {
      ap(pure(add), either(2), either(null)).should.eql(either(null));
      either.of(add).ap(either(2)).ap(either(null)).should.eql(either(null));
    });

    it('ap pure(null) either(2) either(3)', function() {
      ap(pure(null), either(2), either(3)).should.eql(either(null));
      either.of(null).ap(either(2)).ap(either(3)).should.eql(either(null));
    });
  });

  describe('as monad', function() {
    function mayFail(a) { return a > 5 ? either(null) : either(2 * a); }

    it('of 10 chain mayFail', function() {
      either.of(10).chain(mayFail).should.eql(either(null));
    });

    it('of 4 chain mayFail', function() {
      either.of(4).chain(mayFail).should.eql(either(8));
    });

    it('either null chain mayFail', function() {
      either(null).chain(mayFail).should.eql(either(null));
    });
  });
});