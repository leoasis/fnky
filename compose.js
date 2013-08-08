module.exports = function() {
  var funcs = arguments;
  return function() {
    var args = arguments;
    var length = funcs.length;
    while (length--) {
      args = [funcs[length].apply(this, args)];
    }
    return args[0];
  };
};