"use strict";


/**
 * @name flip arguments
 * @type higher order function
 * @example
 *

   flip(x => y => x - y) (3) (2); // -1

 */


// (a -> b -> c) -> b -> a -> c
const flip = f => y => x => f(x) (y);


// API


module.exports = flip;