"use strict";


/**
 * @name pair tuple
 * @type binary constructor
 * @example
 *

   Pair(1, 2) ((x, _) => x); // 1
   Pair(1, 2) ((_, y) => y); // 2

 */


// (a, b) -> ((a, b) => c) -> c
const Pair = (x, y) => f => f(x, y);


// API


module.exports = Pair;