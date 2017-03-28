"use strict";


/**
 * @name swap arguments
 * @type higher order function
 * @example
 *

   swap((x, y) => x / y) (3, 0); // 0

 */


// ((a, b) -> c) -> (b, a) -> c
const swap = f => (y, x) => f(x, y);


// API


module.exports = swap;