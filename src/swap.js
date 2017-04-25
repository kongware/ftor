"use strict";


/**
 * @name swap arguments
 * @type higher order function
 * @example

   ?
   
 */


// ((a, b) -> c) -> (b, a) -> c
const swap = f => (y, x) => f(x, y);


// API


module.exports = swap;