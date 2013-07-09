var curried = require('./curried');

var functor = function(type, definition) {
  type.prototype.fmap = definition.fmap;
};

var fmap = function(f, functor) {
  return functor.fmap(f);
};

functor.fmap = curried(fmap);

module.exports = functor;

functor(Array, {
  fmap: function(f) {
    return this.map(function(x) {
      return f(x);
    });
  }
});

functor(Object, {
  fmap: function(f) {
    var mapped = {};
    for (var key in this) {
      if (this.hasOwnProperty(key))
        mapped[key] = f(this[key]);
    }
    return mapped;
  }
});

functor(Function, {
  fmap: function(f) {
    var self = this;
    return function(x) {
      return f(self(x));
    };
  }
});