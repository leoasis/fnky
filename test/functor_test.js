var functor = require('../functor');

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
});