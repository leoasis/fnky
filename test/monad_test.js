require('should');
var monad = require('../monad');
var pure = monad.pure;

describe('monad', function() {
  describe('definition', function() {
    describe('minimal construction', function() {
      it('throws if chain not defined', function() {
        (function() {
          function Monad(){}
          monad(Monad, {
            of: function() {}
          });
        }).should.throwError("You need to implement the method `chain`");
      });

      it('throws if of not defined', function() {
        (function() {
          function Monad(){}
          monad(Monad, {
            chain: function() {}
          });
        }).should.throwError("You need to implement the method `of`");
      });

      it('must be enough to define chain and of', function() {
        (function() {
          function Monad(){}
          monad(Monad, {
            chain: function() {},
            of: function() {}
          });
        }).should.not.throwError();
      });

      describe('when constructed with chain and of only', function() {
        var Monad, chain, of;

        beforeEach(function() {
          Monad = function() {};
          chain = function() {};
          of = function() {};

          monad(Monad, {
            chain: chain,
            of: of
          });
        });

        it('puts the `chain` function in the monad prototype', function() {
          Monad.prototype.chain.should.equal(chain);
        });

        it('puts the `of` function in the monad constructor', function() {
          Monad.of.should.equal(of);
        });

        it('derives `map` in terms of `chain` and `of` and puts it in the prototype', function() {
          var map = Monad.prototype.map;
          map.should.be.an.instanceOf(Function);
          map.toString().should.include('chain');
          map.toString().should.include('of');
        });

        it('derives `ap` in terms of `chain` and `map` and puts it in the prototype', function() {
          var ap = Monad.prototype.ap;
          ap.should.be.an.instanceOf(Function);
          ap.toString().should.include('chain');
          ap.toString().should.include('map');
        });
      });

      describe('with functions previously defined', function() {
        var Monad, of, map, ap;

        beforeEach(function() {
          Monad = function() {};
          of = function() {};
          map = function() {};
          ap = function() {};
          Monad.of = of;
          Monad.prototype.ap = ap;
          Monad.prototype.map = map;

          monad(Monad, {
            chain: function() {}
          });
        });

        it('preserves `of` if previously defined', function() {
          Monad.of.should.equal(of);
        });

        it('preserves `ap` if previously defined', function() {
          Monad.prototype.ap.should.equal(ap);
        });

        it('preserves `map` if previously defined', function() {
          Monad.prototype.map.should.equal(map);
        });
      });

    });
  });

  describe('instances', function() {
    describe('Array monad', function() {
      function plusMinus(n) { return [n, -n]; }

      it('pure n chain plusMinus', function() {
        pure(2).coerce(Array).chain(plusMinus).should.eql([2, -2]);
        Array.of(2).chain(plusMinus).should.eql([2, -2]);
      });

      it('array chain plusMinus', function() {
        [1, 2, 3].chain(plusMinus).should.eql([1, -1, 2, -2, 3, -3]);
      });
    });
  });
});