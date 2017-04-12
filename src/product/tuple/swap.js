"use strict";


/**
 * @name swap arguments
 * @type higher order function
 * @example

   const pair = Pair(2, 3);
   toArray(swap(pair)); // [3, 2]
   
 */


// ((a, b) -> c) -> (b, a) -> c
const swap = f => (y, x) => f(x, y);


// API


module.exports = swap;