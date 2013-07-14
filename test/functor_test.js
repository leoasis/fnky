require('should');
var functor = require('../functor');
var map = functor.map;

describe('functor', function() {
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