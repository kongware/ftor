"use strict";


// dependencies


const {B_} = require("../B");


/**
 * @name Array
 * @note combined namespace/constructor
 * @type product type
 * @status stable
 */


const Arr = Array.of;


/**
 * @name all
 * @note short circuiting
 * @type higher order function
 * @status stable
 * @example

  const Arr = Array.of;
  Arr.all = pred => xs => xs.every(x => pred(x));
  const even = x => Math.floor(x) === x && (x & 1) === 0;

  Arr.all(even) ([2, 4, 6, 8, 10]); // true
 
 */


// (a -> Boolean) -> [a] -> Boolean
Arr.all = pred => xs => xs.every(x => pred(x));


/**
 * @name any
 * @note short circuiting
 * @type higher order function
 * @status stable
 * @example

  const Arr = Array.of;
  Arr.any = pred => xs => xs.some(x => pred(x));
  const even = x => Math.floor(x) === x && (x & 1) === 0;

  Arr.any(even) ([1, 3, 6, 9, 11]); // true
 
 */


// (a -> Boolean) -> [a] -> Boolean
Arr.any = pred => xs => xs.some(x => pred(x));


/**
 * @name append
 * @type first order function
 * @status stable
 * @example

  const Arr = Array.of;
  Arr.append = xs => x => xs.concat([x]);

  Arr.append([1, 2]) (3); // [1, 2, 3]
  Arr.append([1, 2]) ([3]); // [1, 2, [3]]

 */


// [a] -> a -> [a]
Arr.append = xs => x => xs.concat([x]);


// a -> [a] -> [a]
Arr.append_ = x => xs => xs.concat([x]);


/**
 * @name concat
 * @type first order function
 * @status stable
 * @example

  const Arr = Array.of;
  Arr.concat = xs => ys => xs.concat(ys);

  Arr.concat([1, 2]) ([3, 4]); // [1, 2, 3, 4]

 */


// [a] -> [a] -> [a]
Arr.concat = xs => ys => xs.concat(ys);


// [a] -> [a] -> [a]
Arr.concat_ = ys => xs => xs.concat(ys);


/**
 * @name clone
 * @note shallow
 * @type first order function
 * @example

  const Arr = Array.of;
  Arr.clone = xs => [].concat(xs);

  const xs = [1, 2, 3];
  const ys = clone(xs); // [1, 2, 3]
   
  console.assert(xs !== ys); // passes
 
 */


// [a] -> [a]
Arr.clone = xs => [].concat(xs);


/**
 * @name concat map
 * @type higher order function
 * @status stable
 * @example

  @see ../foldmap

 */


// (a -> [b]) -> [a] -> [b]
Arr.concatMap = f => Arr.fold(B_(Arr.append, f)) ([]);


/**
 * @name drop
 * @type first order function
 * @status stable
 * @example

  const Arr = Array.of;
  Arr.drop = n => xs => xs.slice(n);

  Arr.drop(2) ([1, 2, 3, 4, 5]); // [3, 4, 5]
 
 */


// Number -> [a] -> [a]
Arr.drop = n => xs => xs.slice(n);


/**
 * @name empty
 * @type constant
 * @status stable
 */


Arr.empty = [];


/**
 * @name filter
 * @type higher order function
 * @status stable
 * @example

  const Arr = Array.of;
  Arr.filter = pred => xs => xs.filter(x => pred(x));
  const even = x => Math.floor(x) === x && (x & 1) === 0;

  Arr.filter(even) ([1, 2, 3]); // [2]
 
 */


// (a -> Boolean) -> [a] -> [a]
Arr.filter = pred => xs => xs.filter(x => pred(x));


/**
 * @name find
 * @note short circuiting
 * @type higher order function
 * @status stable
 * @example

  const Arr = Array.of;
  Arr.find = f => xs => xs.find(x => f(x));
  const even = x => Math.floor(x) === x && (x & 1) === 0;

  Arr.find(even) ([1, 2, 3]); // 2
  Arr.find(even) ([1, 3, 5]); // undefined
 
 */


// (a -> Boolean) -> [a] -> a
Arr.find = pred => xs => xs.find(x => pred(x));


/**
 * @name findOr
 * @note short circuiting
 * @type higher order function
 * @status stable
 * @example

  const Arr = Array.of;
  
  Arr.findOr = x => pred => xs => {
    const y = xs.find(x => pred(x));
    return y === undefined ? x : y;
  };
  
  const even = x => Math.floor(x) === x && (x & 1) === 0;

  Arr.findOr(0) (even) ([1, 2, 3]); // 2
  Arr.findOr(0) (even) ([1, 3, 5]); // 0
 
 */


// a -> (a -> Boolean) -> [a] -> a
Arr.findOr = x => pred => xs => {
  const y = xs.find(x => pred(x));
  return y === undefined ? x : y;
};


/**
 * @name find index
 * @note short circuiting
 * @type higher order function
 * @status stable
 * @example

  const Arr = Array.of;
  Arr.findIndex = f => xs => xs.findIndex(x => f(x));

  const even = x => Math.floor(x) === x && (x & 1) === 0;

  Arr.findIndex(even) ([1, 2, 3]); // 1
  Arr.findIndex(even) ([1, 3, 5]); // -1

 */


// (a -> Boolean) -> [a] -> Number
Arr.findIndex = f => xs => xs.findIndex(x => f(x));


/**
 * @name fold
 * @note fold right by flipped reducer
 * @type higher order function
 * @status stable
 * @example

  const Arr = Array.of;
  Arr.fold = f => acc => xs => xs.reduce((acc, x) => f(acc) (x), acc);
  const sub = x => y => x - y;
  const sub_ = y => x => x - y;

  Arr.fold(sub) (0) ([1, 2, 3, 4, 5]); // -15
  Arr.fold(sub_) (0) ([1, 2, 3, 4, 5]); // 3
 
 */


// (a -> b -> a) -> a -> [b] -> a
Arr.fold = f => acc => xs => xs.reduce((acc, x) => f(acc) (x), acc);


/**
 * @name fold without accumulator
 * @note unsafe with empty list
 * @type higher order function
 * @status stable
 * @example

  const Arr = Array.of;
  Arr.fold1 = f => xs => xs.reduce((acc, x) => f(acc) (x));
  const add = x => y => x + y;

  Arr.fold1(add) ([1, 2, 3]); // 6
  Arr.fold1(add) ([]); // TypeError

 */


// (a -> a -> a) -> [a] -> a
Arr.fold1 = f => xs => xs.reduce((acc, x) => f(acc) (x));


/**
 * @name fold left continuation
 * @note mutual recursion; requires the reducer to be in CPS
 * @type higher order function
 * @status stable
 * @todo verify type signature
 * @example

  ??

 */


// (a -> b -> (a -> a) -> a) -> a -> [b] -> a
Arr.foldlk = f => acc => xs => {
  const aux = (acc, i) => xs.length === i
   ? acc
   : f(acc) (xs[i]) (acc => aux(acc, i + 1));

  return aux(acc, 0);
};


/**
 * @name fold right continuation
 * @note mutual recursion; requires the reducer to be in CPS
 * @type higher order function
 * @status stable
 * @todo verify type signature
 * @example

  ??

 */


// (a -> b -> (b -> b) -> b) -> b -> [a] -> b
Arr.foldrk = f => acc => xs => {
  const aux = (acc, i) => i < 0
   ? acc
   : f(xs[i]) (acc, i) (acc => aux(acc, i - 1));

  return aux(acc, xs.length - 1);
};


/**
 * @name for each
 * @note performs side effects
 * @type higher order function
 * @status stable
 * @example

  const Arr = Array.of;
  Arr.forEach = f => xs => xs.forEach(x => f(x));

  Arr.forEach(console.log) ([1, 2, 3]); // 1, 2, 3
 
 */


// ?
Arr.forEach = f => xs => xs.forEach(x => f(x));


/**
 * @name array from
 * @type first order function
 * @status stable
 * @example

  const Arr = Array.of;
  Arr.from = x => Array.from(x);
  const m = new Map();

  m.set(1, "foo");
  Arr.from(m); [1, "foo"]
 
 */


// Iterable a -> [a]
Arr.from = x => Array.from(x);


/**
 * @name head
 * @note unsafe
 * @type first order function
 * @status stable
 * @example

  const Arr = Array.of;
  Arr.head = xs => xs[0];

  head([1, 2, 3]); // 1
  head([]); // undefined
 
 */


// [a] -> a
Arr.head = xs => xs[0];


/**
 * @name head or
 * @note safe by default value
 * @type first order function
 * @status stable
 * @example

  const Arr = Array.of;
  Arr.headOr = x => xs => 0 in xs ? xs[0] : x;

  Arr.headOr(0) ([1, 2, 3]); // 1
  Arr.headOr(0) ([]); // 0
 
 */


// a -> [a] -> a
Arr.headOr = x => xs => 0 in xs ? xs[0] : x;


/**
 * @name includes
 * @note short circuiting
 * @type first order function
 * @status stable
 * @example

  const Arr = Array.of;
  Arr.includes = x => xs => xs.includes(x);

  Arr.includes(2) ([1, 2, 3]); // true
 
 */


// a -> [a] -> Boolean
Arr.includes = x => xs => xs.includes(x);


/**
 * @name initial elements
 * @type first order function
 * @status stable
 * @example

  const Arr = Array.of;
  Arr.init = xs => xs.slice(0, -1);

  Arr.init([1, 2, 3]); // [1, 2]
 
 */


// [a] -> [a]
Arr.init = xs => xs.slice(0, -1);


/**
 * @name last_
 * @note unsafe
 * @type first order function
 * @status stable
 * @example

  const Arr = Array.of;
  Arr.last = xs => xs[xs.length - 1];

  Arr.last([1, 2, 3]); // 3
  Arr.last([]); // undefined

 */


// [a] -> a
Arr.last = xs => xs[xs.length - 1];


/**
 * @name last or
 * @note safe by default value
 * @type first order function
 * @status stable
 * @example

  const Arr = Array.of;
  Arr.lastOr = x => xs => xs.length - 1 in xs ? xs[xs.length - 1] : x;

  Arr.lastOr([1, 2, 3]); // 3
  Arr.lastOr(0) ([]); // 0

 */


// [a] -> a
Arr.lastOr = x => xs => xs.length - 1 in xs ? xs[xs.length - 1] : x;


/**
 * @name lift
 * @type higher order function
 * @status experimental
 * @example

  const Arr = Array.of;
  Arr.lift = f => args => args.reduce((f, x) => f(x), f);
  const add = x => y => x + y;

  Arr.lift(add) ([2, 3]); // 5

 */


// ?
Arr.lift = f => args => args.reduce((f, x) => f(x), f);


/**
 * @name paramorphism
 * @type higher order function
 * @status stable
 * @example

  ??
 
 */


// (a -> [b] -> b -> a) -> a -> [b] -> a
Arr.para = f => acc => xs => {
  const aux = (acc, [head, ...tail]) => head === undefined
   ? acc
   : aux(f(acc) (tail) (head), tail);

  return aux(acc, xs);
};


/**
 * @name left paramorphism continuation
 * @note requires reducer to be in CPS
 * @type higher order function
 * @status stable
 * @todo verify type signature
 * @example

  ??
 
 */


// (a -> [b] -> b -> (a -> a) -> a) -> a -> [b] -> a
Arr.paralk = f => acc => xs => {
  const aux = (acc, [head, ...tail]) => head === undefined
   ? acc
   : f(acc) (tail) (head) (acc => aux(acc, tail));

  return aux(acc, xs);
};


/**
 * @name right paramorphism continuation
 * @note requires reducer to be in CPS
 * @type higher order function
 * @status stable
 * @todo verify type signature
 * @example

  ??
 
 */


// (a -> [a] -> b -> (b -> b) -> b) -> b -> [a] -> b
Arr.parark = f => acc => xs => {
  const aux = (acc, head, tail) => head === undefined
   ? acc
   : f(head) (tail) (acc) (acc => aux(acc, tail[tail.length - 1], tail.slice(0, -1)));

  return aux(acc, xs[xs.length - 1], xs.slice(0, -1));
};


/**
 * @name pop
 * @note second version is impure
 * @type first order function
 * @status stable
 * @example

  const Arr = Array.of;

  Arr.pop = xs => {
    const ys = [].concat(xs);
    return [ys.pop(), ys];
  };


  Arr.pop_ = xs => [xs.pop(), xs];

  const xs = [1, 2, 3],
   ys = Arr.pop(xs), // [3, [1, 2]]
   zs = Arr.pop_(xs); // [3, [1, 2]]

  console.assert(xs !== ys[1]); // passes
  console.assert(xs === zs[1]); // passes

 */


// [a] -> [a, [a]]
Arr.pop = xs => {
  const ys = [].concat(xs);
  return [ys.pop(), ys];
};


// [a] -> [a, [a]]
Arr.pop_ = xs => [xs.pop(), xs];


/**
 * @name prepend
 * @type first order function
 * @status stable
 * @example

  const Arr = Array.of;
  Arr.prepend = xs => x => [x].concat(xs);

  Arr.prepend([1, 2]) (0); // [0, 1, 2]
  Arr.prepend([1, 2]) ([3]); // [[0], 1, 2]

 */


// [a] -> a -> [a]
Arr.prepend = xs => x => [x].concat(xs);


// a -> [a] -> [a]
Arr.prepend_ = x => xs => [x].concat(xs);


/**
 * @name reverse
 * @type first order function
 * @status stable
 * @example

  const Arr = Array.of;
  Arr.reverse = xs => xs.reverse();

  Arr.reverse([1, 2, 3]); // [3, 2, 1]

 */


// [a] -> [a]
Arr.reverse = xs => xs.reverse();


/**
 * @name shift
 * @note second version is impure
 * @type first order function
 * @status stable
 * @example

  const Arr = Array.of;

  Arr.shift = xs => {
    const ys = [].concat(xs);
    return [ys.shift(), ys];
  };

  Arr.shift_ = xs => [xs.shift(), xs];

  const xs = [1, 2, 3],
   ys = Arr.shift(xs), // [1, [2, 3]]
   zs = Arr.shift_(xs); // [1, [2, 3]]

  console.assert(xs !== ys[1]); // passes
  console.assert(xs === zs[1]); // passes

 */


// [a] -> [a, [a]]
Arr.shift = xs => {
  const ys = [].concat(xs);
  return [ys.shift(), ys];
};


// [a] -> [a, [a]]
Arr.shift_ = xs => [xs.shift(), xs];


/**
 * @name sort
 * @type higher order function
 * @status stable
 * @example

  const Arr = Array.of;

  Arr.sort = f => xs => {
    const ys = [].concat(xs);
    return ys.sort((x, y) => f(x) (y));
  };

  const compare = x => y => x < y ? -1 : y < x ? 1 : 0;
  const compare_ = y => x => x < y ? -1 : y < x ? 1 : 0;

  const xs = [5, 3, 1, 4, 2],
   ys = Arr.sort(compare) (xs); // [1, 2, 3, 4, 5]

  console.assert(xs !== ys); // passes

  Arr.sort(compare_) (xs); // [5, 4, 3, 2, 1]

 */


// (a -> b) -> [a] -> [a]
Arr.sort = f => xs => {
  const ys = [].concat(xs);
  return ys.sort((x, y) => f(x) (y));
};


/**
 * @name tail
 * @type first order function
 * @status stable
 * @example

  const Arr = Array.of;
  Arr.tail = xs => xs.slice(1);

  Arr.tail([1, 2, 3]); // [2, 3]
 
 */


// [a] -> [a]
Arr.tail = xs => xs.slice(1);


/**
 * @name take
 * @type first order function
 * @status stable
 * @example

  const Arr = Array.of;
  Arr.take = n => xs => xs.slice(0, n);

  Arr.take(3) ([1, 2, 3, 4, 5]); // [1, 2, 3]
 
 */


// Number -> [a] -> [a]
Arr.take = n => xs => xs.slice(0, n);


// API


module.exports = Arr;