var monad = require('../monad');

describe('monad', function() {
  describe('definition', function() {
    it('throws if chain not defined', function() {
      expect(function() {
        function Monad(){}
        monad(Monad, {
          of: function() {}
        });
      }).to.throw("You need to implement the method `chain`");
    });

    it('throws if of not defined', function() {
      expect(function() {
        function Monad(){}
        monad(Monad, {
          chain: function() {}
        });
      }).to.throw("You need to implement the method `of`");
    });

    it('must be enough to define chain and of', function() {
      expect(function() {
        function Monad(){}
        monad(Monad, {
          chain: function() {},
          of: function() {}
        });
      }).to.not.throw();
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
        expect(Monad.prototype.chain).to.equal(chain);
      });

      it('puts the `of` function in the monad constructor', function() {
        expect(Monad.of).to.equal(of);
      });

      it('derives `map` in terms of `chain` and `of` and puts it in the prototype', function() {
        var map = Monad.prototype.map;
        expect(map).to.be.an.instanceOf(Function);
        expect(map.toString()).to.include('chain');
        expect(map.toString()).to.include('of');
      });

      it('derives `ap` in terms of `chain` and `map` and puts it in the prototype', function() {
        var ap = Monad.prototype.ap;
        expect(ap).to.be.an.instanceOf(Function);
        expect(ap.toString()).to.include('chain');
        expect(ap.toString()).to.include('map');
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
        expect(Monad.of).to.equal(of);
      });

      it('preserves `ap` if previously defined', function() {
        expect(Monad.prototype.ap).to.equal(ap);
      });

      it('preserves `map` if previously defined', function() {
        expect(Monad.prototype.map).to.equal(map);
      });
    });
  });

  describe('monadic compose', function() {
    function duplicate(n) { return [n, n]; }
    function plusMinus(n) { return [n, -n]; }
    function withChar(n) { return ['a', n]; }

    it('compose(withChar, duplicate, plusMinus)', function() {
      var arr = [1, 2, 3];
      var work = monad.compose(withChar, duplicate, plusMinus);
      expect(work(arr)).to.eql(arr.chain(plusMinus).chain(duplicate).chain(withChar));
    });
  });
});