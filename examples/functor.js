var functor = require('../functor');
var map = functor.map;
var curried = require('../curried');
var Maybe = require('../maybe');

function length(val) {
  return val.length;
}

var add = curried(function(a, b) { return a + b; });

function sayTheNumber(num) {
  return "I'm telling you the number " + num;
}

console.log(map(function(val) { return val * 3; }, [1, 2, 3]));
console.log(map(sayTheNumber, [1, 2, 3]));
console.log(map(length, { a: "hola", b: "mundo" }));

var add8 = add(8);
console.log(map(add(8), [1, 2, 3]));
console.log(map(add8, [1, 2, 3]));


function Tree(value, left, right) {
  this.value = value;
  if (left) this.left = left;
  if (right) this.right = right;
}

var tree = new Tree(1, new Tree(2, new Tree(4), new Tree(5)), new Tree(3));

console.log(tree);

functor(Tree, {
  map: function(f) {
    var mappedLeft = this.left && map(f, this.left);
    var mappedRight = this.right && map(f, this.right);
    return new Tree(f(this.value), mappedLeft, mappedRight);
  }
});

console.log(map(function(val) { return val * 3; }, tree));


console.log(map(length, sayTheNumber)(15));

var liftedAdd8 = map(add8);

console.log(liftedAdd8(Maybe(10)));
console.log(liftedAdd8(Maybe(null)));

console.log(liftedAdd8([1, 2, 3, 4]));
console.log(liftedAdd8([]));


