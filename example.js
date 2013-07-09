var functor = require('./functor');
var fmap = functor.fmap;
var curried = require('./curried');

function length(val) {
  return val.length;
}

var add = curried(function(a, b) { return a + b; });

function sayTheNumber(num) {
  return "I'm telling you the number " + num;
}

console.log(fmap(function(val) { return val * 3; }, [1, 2, 3]));
console.log(fmap(sayTheNumber, [1, 2, 3]));
console.log(fmap(length, { a: "hola", b: "mundo" }));

var add8 = add(8);
console.log(fmap(add(8), [1, 2, 3]));


function Tree(value, left, right) {
  this.value = value;
  if (left) this.left = left;
  if (right) this.right = right;
}

var tree = new Tree(1, new Tree(2, new Tree(4), new Tree(5)), new Tree(3));

console.log(tree);

functor(Tree, {
  fmap: function(f) {
    var mappedLeft = this.left && fmap(f, this.left);
    var mappedRight = this.right && fmap(f, this.right);
    return new Tree(f(this.value), mappedLeft, mappedRight);
  }
});

console.log(fmap(function(val) { return val * 3; }, tree));


console.log(fmap(length, sayTheNumber)(15));
