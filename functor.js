var curried = require('./curried');

var functor = function(type, definition) {
  type.prototype.map = definition.map;
};

var map = function(f, functor) {
  return functor.map(f);
};

functor.map = curried(map);

module.exports = functor;

functor(Object, {
  map: function(f) {
    var mapped = {};
    for (var key in this) {
      if (this.hasOwnProperty(key))
        mapped[key] = f(this[key]);
    }
    return mapped;
  }
});

functor(Function, {
  map: function(f) {
    var self = this;
    return function(x) {
      return f(self(x));
    };
  }
});