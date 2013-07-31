var monoid = require('../../monoid');
var concat = monoid.concat;
var Sum = require('../../types/sum');

describe('Sum', function() {
  describe('as monoid', function() {
    it('empty', function() {
      expect(Sum.empty()).to.eql(Sum(0));
    });

    it('Sum 1 concat Sum 3 concat Sum 6', function() {
      expect(concat(Sum(1), Sum(3), Sum(6))).to.eql(Sum(10));
      expect(Sum(1).concat(Sum(3)).concat(Sum(6))).to.eql(Sum(10));
    });
  });
});