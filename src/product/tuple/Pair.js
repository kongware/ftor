"use strict";


/**
 * @name pair tuple
 * @type data constructor
 * @example

   Pair(1, 2) (_1st); // 1
   Pair(1, 2) (_2nd); // 2

 */


// (a, b) -> ((a, b) => c) -> c
const Pair = (x, y) => f => f(x, y);


// API


module.exports = Pair;