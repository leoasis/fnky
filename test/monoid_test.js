var monoid = require('../monoid');

describe('monoid', function() {
  describe('definition', function() {
    it('throws if empty not defined', function() {
      expect(function() {
        function Monoid(){}
        monoid(Monoid, {
          concat: function() {}
        });
      }).to.throw("You need to implement the method `empty`");
    });

    it('throws if concat not defined', function() {
      expect(function() {
        function Monoid(){}
        monoid(Monoid, {
          empty: function() {}
        });
      }).to.throw("You need to implement the method `concat`");
    });

    describe('when fully constructed', function() {
      var Monoid, concat, empty;

      beforeEach(function() {
        Monoid = function() {};
        concat = function() {};
        empty = function() {};

        monoid(Monoid, {
          concat: concat,
          empty: empty
        });
      });

      it('puts the `concat` function in the monoid prototype', function() {
        expect(Monoid.prototype.concat).to.equal(concat);
      });

      it('puts the `empty` function in the monoid constructor', function() {
        expect(Monoid.empty).to.equal(empty);
      });

      it('puts the `empty` function in the monoid prototype', function() {
        expect(Monoid.prototype.empty).to.equal(empty);
      });
    });

    describe('with functions previously defined', function() {
      var Monoid, empty;

      beforeEach(function() {
        Monoid = function() {};
        empty = function() {};

        Monoid.empty = empty;

        monoid(Monoid, {
          concat: function() {}
        });
      });

      it('preserves `empty` if previously defined', function() {
        expect(Monoid.empty).to.equal(empty);
      });
    });
  });
});