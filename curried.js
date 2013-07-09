module.exports = function(length, f) {
  if (arguments.length === 1) {
    f = length;
    length = f.length;
  }
  return partiallyApply(f, length, []);
};

function partiallyApply(f, length, args) {
  if (args.length >= length) {
    return f.apply(null, args);
  } else {
    return function() {
      var newArgs = args.concat(Array.prototype.slice.call(arguments));
      return partiallyApply(f, length, newArgs);
    };
  }
}