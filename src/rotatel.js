"use strict";


/**
 * @name rotate left
 * @type higher order function
 * @example

   const reduce = (xs, f, acc) => xs.reduce(f, acc);
   const composable = f => (...args) => x => f(...args, x);
   const add = (x, y) => x + y;
   const xs = [1, 2, 3, 4];

   const sum = composable(rotatel(reduce)) (add, 0);

   sum(xs); // 10

 */


// ((a, b, c) -> d) -> (b, c, a) -> d
const rotatel = f => (y, z, x) => f(x, y, z);


// ((a, b, c, d) -> e) -> (b, c, d, a) -> e
const rotatel4 = f => (x, y, z, w) => f(w, x, y, z);


// ((a, b, c, d, e) -> f) -> (b, c, d, e, a) -> f
const rotatel5 = f => (w, x, y, z, v) => f(v, w, x, y, z);


// API


module.exports = {rotatel, rotatel4, rotatel5};