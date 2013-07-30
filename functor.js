var utils = require('./utils');
var curried = require('./curried');
var ownFunctionFrom = utils.ownFunctionFrom;

var functor = function(type, definition) {
  var mapFn = ownFunctionFrom(type.prototype, 'map') || ownFunctionFrom(definition, 'map');
  utils.check(mapFn, 'notImplemented', 'map');

  type.prototype.map = mapFn;
};

var map = function(f, functor) {
  return functor.map(f);
};

functor.map = curried(map);

module.exports = functor;

functor(Function, {
  map: function(f) {
    var self = this;
    return function(x) {
      return f(self(x));
    };
  }
});