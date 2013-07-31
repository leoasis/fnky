var monad = require('../monad');
var monoid = require('../monoid');

monad(Array, {
  // map: already defined in Array
  of: function(value) {
    return [value];
  },
  ap: function(other) {
    var ret = [];
    this.forEach(function(f) {
      other.forEach(function(x) {
        ret.push(f(x));
      });
    });
    return ret;
  },
  chain: function(f) {
    return this.map(function(x) { return f(x); })
        .reduce(function(list, x) { return list.concat(x); }, []);
  }
});

monoid(Array, {
  empty: function() { return []; }
  // concat: already defined in Array
});

module.exports = Array;