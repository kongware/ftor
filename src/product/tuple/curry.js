"use strict";


/**
 * @name curry binary function
 * @type higher order function
 * @example
 *

   const add2 = curry((x, y) => x + y) (2);
   add2(3); // 5

 */


// ((a, b) -> c) -> a -> b -> c
const curry = f => x => y => f(x, y);


// API


module.exports = curry;