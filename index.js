var fnky = {
  functor: require('./functor'),
  applicative: require('./applicative'),
  monad: require('./monad'),
  monoid: require('./monoid'),
  curried: require('./curried'),
  types: {
    Maybe: require('./types/maybe'),
    Either: require('./types/either'),
    Sum: require('./types/sum'),
    Product: require('./types/product'),
    Array: require('./types/array'),
    Function: require('./types/function')
  }
};

module.exports = fnky;