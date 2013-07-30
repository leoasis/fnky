var functor = require('../functor');
var map = functor.map;

describe('functor', function() {
  describe('definition', function() {
    it('throws if map not defined', function() {
      expect(function() {
        function Functor(){}
        functor(Functor, {});
      }).to.throw("You need to implement the method `map`");
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
        expect(Functor.prototype.map).to.equal(map);
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
        expect(Functor.prototype.map).to.equal(map);
      });
    });
  });

  describe('instances', function() {
    function inc(n) { return n + 1; }

    describe('Array functor', function() {
      it('map inc [1, 2, 3]', function() {
        expect(map(inc, [1, 2, 3])).to.eql([2, 3, 4]);
        expect([1, 2, 3].map(inc)).to.eql([2, 3, 4]);
      });

      it('map inc []', function() {
        expect(map(inc, [])).to.eql([]);
        expect([].map(inc)).to.eql([]);
      });
    });

    describe('Object functor', function() {
      it('map inc { a: 1, b: 2, c: 3 }', function() {
        expect(map(inc, { a: 1, b: 2, c: 3 })).to.eql({ a: 2, b: 3, c: 4 });
        expect(({ a: 1, b: 2, c: 3 }).map(inc)).to.eql({ a: 2, b: 3, c: 4 });
      });
    });

    describe('Function functor', function() {
      function half(n) { return n  / 2; }

      it('map inc half', function() {
        expect(map(inc, half)(4)).to.equal(3);
        expect(map(inc, half)(2)).to.equal(2);

        expect(half.map(inc)(4)).to.equal(3);
        expect(half.map(inc)(2)).to.equal(2);
      });
    });
  });
});