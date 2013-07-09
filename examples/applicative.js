var curried = require('../curried');
var Maybe = require('../maybe');

var functor = require('../functor');
var fmap = functor.fmap;

var applicative = require('../applicative');
var pure = applicative.pure;
var ap = applicative.ap;


var add = curried(function(a, b) { return a + b; });

console.log('ap(pure(add(2)), Maybe(3))');
console.log(ap(pure(add(2)), Maybe(3)));

var apWith4 = ap(pure(add(4)));

console.log('var apWith4 = ap(pure(add(4)));');
console.log('apWith4(Maybe(3))');
console.log(apWith4(Maybe(3)));

console.log('ap(fmap(add, Maybe(2)), Maybe(4))');
console.log(ap(fmap(add, Maybe(2)), Maybe(4)));


console.log('ap(fmap(add, [1, 2, 3]), [4, 5, 6])');
console.log(ap(fmap(add, [1, 2, 3]), [4, 5, 6]));


console.log('ap(pure(add), [1, 2, 3], [4, 5, 6])');
console.log(ap(pure(add), [1, 2, 3], [4, 5, 6]));