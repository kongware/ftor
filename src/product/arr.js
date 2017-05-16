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

  Arr.concat([1, 2]) (3); // [1, 2, 3]
  Arr.concat([1, 2]) ([3]); // [1, 2, 3]

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

  @see ../concatMapBy

 */


// (a -> b -> a) -> (a -> [b]) -> [a] -> [b]
Arr.concatMap = f => Arr.foldl(B_(Arr.concat, f)) ([]);


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
 * @name fold left
 * @type higher order function
 * @status stable
 * @example

  const Arr = Array.of;
  Arr.foldl = f => acc => xs => xs.reduce((acc, x) => f(acc) (x), acc);
  const sub = x => y => x - y;
  const sub_ = y => x => x - y;

  Arr.foldl(sub) (0) ([1, 2, 3, 4, 5]); // -15
  Arr.foldl(sub_) (0) ([1, 2, 3, 4, 5]); // 3
 
 */


// (a -> b -> a) -> a -> [b] -> a
Arr.foldl = f => acc => xs => xs.reduce((acc, x) => f(acc) (x), acc);


/**
 * @name fold right
 * @type higher order function
 * @status stable
 * @example

  const Arr = Array.of;
  Arr.foldr = f => acc => xs => xs.reduceRight((acc, x) => f(x) (acc), acc);
  const sub = x => y => x - y;
  const sub_ = y => x => x - y;

  Arr.foldr(sub) (0) ([1, 2, 3, 4, 5]); // 3
  Arr.foldr(sub_) (0) ([1, 2, 3, 4, 5]); // -15
 
 */


// (a -> b -> b) -> b -> [a] -> b
Arr.foldr = f => acc => xs => xs.reduceRight((acc, x) => f(x) (acc), acc);


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