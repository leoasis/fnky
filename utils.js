var hasProperty = exports.hasProperty = function(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
};

exports.ownPropFrom = function(obj, prop) {
  return hasProperty(obj, prop) ? obj[prop] : null;
};

var isFunction = exports.isFunction = function(f) {
  return typeof f === "function";
};

exports.isOwnFunction = function(obj, prop) {
  return hasProperty(obj, prop) && isFunction(obj[prop]);
};