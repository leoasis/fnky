var utils = require('./utils');
var curried = require('./curried');
var hasProperty = utils.hasProperty;
var ownFunctionFrom = utils.ownFunctionFrom;

var functor = function(type, definition) {
  var mapFn = ownFunctionFrom(type.prototype, 'map') || ownFunctionFrom(definition, 'map');
  if (!mapFn)
    throw new Error("You need to implement the method `map`");

  type.prototype.map = mapFn;
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
      if (hasProperty(this, key))
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