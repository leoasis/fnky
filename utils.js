var hasProperty = exports.hasProperty = function(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
};

exports.ownPropFrom = function(obj, prop) {
  return hasProperty(obj, prop) ? obj[prop] : null;
};

var isFunction = exports.isFunction = function(f) {
  return typeof f === "function";
};

var isOwnFunction = exports.isOwnFunction = function(obj, prop) {
  return hasProperty(obj, prop) && isFunction(obj[prop]);
};

exports.ownFunctionFrom = function(obj, prop) {
  return isOwnFunction(obj, prop) ? obj[prop] : null;
};

var messages = {
  notImplemented: function(method) {
    throw new Error("You need to implement the method `" + method + "`");
  }
};

exports.check = function(what, message, arg) {
  if (!what) messages[message](arg);
};