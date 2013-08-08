var compose = require('../compose');

describe('compose', function() {
  it('combines functions and executes from right to left', function() {
    var inc = function(n) { return n + 1; };
    var by2 = function(n) { return n * 2; };
    var roots = function(n) { return [-Math.sqrt(n), Math.sqrt(n)]; };
    var chooseNegative = function(numbers) {
      return numbers.filter(function(n) {
        return n < 0;
      })[0];
    };
    expect(compose(chooseNegative, roots, by2, inc)(1)).to.equal(chooseNegative(roots(by2(inc(1)))));
  });
});