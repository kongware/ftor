"use strict";


/**
 * @name swap arguments
 * @type higher order function
 * @example
 *

   Pair(2, 3) (swap((x, y) => x - y)); // 1
   swap((x, y) => x - y) (2, 3); // 1
   
 */


// ((a, b) -> c) -> (b, a) -> c
const swap = f => (y, x) => f(x, y);


// API


module.exports = swap;