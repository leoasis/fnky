require('should');
var functor = require('../functor');
var map = functor.map;

describe('functor', function() {
  describe('definition', function() {
    it('throws if map not defined', function() {
      (function() {
        function Functor(){}
        functor(Functor, {});
      }).should.throwError("You need to implement the method `map`");
    });

    describe('when constructed with map', function() {
      var Functor, map;

      beforeEach(function() {
        Functor = function() {};
        map = function() {};

        functor(Functor, {
          map: map
        });
      });

      it('puts the `map` function in the functor prototype', function() {
        Functor.prototype.map.should.equal(map);
      });
    });

    describe('with functions previously defined', function() {
      var Functor, map;

      beforeEach(function() {
        Functor = function() {};
        map = function() {};
        Functor.prototype.map = map;

        functor(Functor, {});
      });

      it('preserves `map` if previously defined', function() {
        Functor.prototype.map.should.equal(map);
      });
    });
  });

  describe('instances', function() {
    function inc(n) { return n + 1; }

    describe('Array functor', function() {
      it('map inc [1, 2, 3]', function() {
        map(inc, [1, 2, 3]).should.eql([2, 3, 4]);
        [1, 2, 3].map(inc).should.eql([2, 3, 4]);
      });

      it('map inc []', function() {
        map(inc, []).should.eql([]);
        [].map(inc).should.eql([]);
      });
    });

    describe('Object functor', function() {
      it('map inc { a: 1, b: 2, c: 3 }', function() {
        map(inc, { a: 1, b: 2, c: 3 }).should.eql({ a: 2, b: 3, c: 4 });
        ({ a: 1, b: 2, c: 3 }).map(inc).should.eql({ a: 2, b: 3, c: 4 });
      });
    });

    describe('Function functor', function() {
      function half(n) { return n  / 2; }

      it('map inc half', function() {
        map(inc, half)(4).should.equal(3);
        map(inc, half)(2).should.equal(2);

        half.map(inc)(4).should.equal(3);
        half.map(inc)(2).should.equal(2);
      });
    });
  });
});