require('../../types/function');
var curried = require('../../curried');
var functor = require('../../functor');
var map = functor.map;
var applicative = require('../../applicative');
var ap = applicative.ap;
var pure = applicative.pure;

describe("Function", function() {
  describe("as functor", function() {
    function half(n) { return n  / 2; }
    function inc(n) { return n + 1; }

    it('map inc half', function() {
      expect(map(inc, half)(4)).to.equal(3);
      expect(map(inc, half)(2)).to.equal(2);

      expect(half.map(inc)(4)).to.equal(3);
      expect(half.map(inc)(2)).to.equal(2);
    });
  });

  describe("as applicative", function() {
    var add = curried(function(a, b) { return a + b; });

    it('pure/of 1', function() {
      expect(pure(1).coerce(Function)("whatever")).to.eql(1);
      expect(Function.of(1)("whatever")).to.eql(1);
      expect((function() {}).of(1)("whatever")).to.eql(1);
    });

    function plus3(n) { return n + 3; }
    function by5(n) { return n * 5; }

    it('ap pure(add) plus3 by5', function() {
      expect(ap(pure(add), plus3, by5)(3)).to.eql(21);
      expect(Function.of(add).ap(plus3).ap(by5)(3)).to.eql(21);
    });
  });
});