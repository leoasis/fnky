var curried = require('../curried');
var applicative = require('../applicative');
var ap = applicative.ap;
var pure = applicative.pure;

describe('applicative', function() {
  describe('definition', function() {
    it('throws if ap not defined', function() {
      expect(function() {
        function Applicative(){}
        applicative(Applicative, {
          of: function() {}
        });
      }).to.throw("You need to implement the method `ap`");
    });

    it('throws if of not defined', function() {
      expect(function() {
        function Applicative(){}
        applicative(Applicative, {
          ap: function() {}
        });
      }).to.throw("You need to implement the method `of`");
    });

    describe('when fully constructed', function() {
      var Applicative, ap, of;

      beforeEach(function() {
        Applicative = function() {};
        ap = function() {};
        of = function() {};

        applicative(Applicative, {
          ap: ap,
          of: of
        });
      });

      it('puts the `ap` function in the applicative prototype', function() {
        expect(Applicative.prototype.ap).to.equal(ap);
      });

      it('puts the `of` function in the applicative constructor', function() {
        expect(Applicative.of).to.equal(of);
      });

      it('puts the `of` function in the applicative prototype', function() {
        expect(Applicative.prototype.of).to.equal(of);
      });

      it('derives `map` in terms of `ap` and `of` and puts it in the prototype', function() {
        var map = Applicative.prototype.map;
        expect(map).to.be.an.instanceOf(Function);
        expect(map.toString()).to.include('ap');
        expect(map.toString()).to.include('of');
      });
    });

    describe('with functions previously defined', function() {
      var Applicative, of, map, ap;

      beforeEach(function() {
        Applicative = function() {};
        of = function() {};
        map = function() {};
        ap = function() {};
        Applicative.of = of;
        Applicative.prototype.ap = ap;
        Applicative.prototype.map = map;

        applicative(Applicative, {});
      });

      it('preserves `of` if previously defined', function() {
        expect(Applicative.of).to.equal(of);
        expect(Applicative.prototype.of).to.equal(of);
      });

      it('preserves `ap` if previously defined', function() {
        expect(Applicative.prototype.ap).to.equal(ap);
      });

      it('preserves `map` if previously defined', function() {
        expect(Applicative.prototype.map).to.equal(map);
      });
    });
  });

  describe('instances', function() {
    var add = curried(function(a, b) { return a + b; });

    describe('Array applicative', function() {
      it('pure/of 1', function() {
        expect(pure(1).coerce(Array)).to.eql([1]);
        expect(Array.of(1)).to.eql([1]);
        expect([].of(1)).to.eql([1]);
      });

      it('ap pure(add) [1, 2] [3, 4]', function() {
        expect(ap(pure(add), [1, 2], [3, 4])).to.eql([4, 5, 5, 6]);
        expect(Array.of(add).ap([1, 2]).ap([3, 4])).to.eql([4, 5, 5, 6]);
        //expect([1, 2].map(add).ap([3, 4])).to.eql([4, 5, 5, 6]);
      });
    });

    describe('Function applicative', function() {
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
});