"use strict";


/**
 * @name pair tuple
 * @type data constructor
 * @example

   const Pair = (x, y) => f => f(x, y);
   const toArray = (...args) => args;
   const I = x => x;
   const get1 = I;
   const get2 = (_, x) => x;

   Pair(1, "a") (toArray); // [1, "a"]
   Pair(1, "a") (get1); // 1
   Pair(1, "a") (get2); // "a"

 */


// (a, b) -> ((a, b) => c) -> c
const Pair = (x, y) => f => f(x, y);


// API


module.exports = Pair;