"use strict";


/**
 * @name cardinal combinator (flip arguments)
 * @type higher order function
 * @example
 *

   C(x => y => x - y) (3) (2); // -1

 */


// (a -> b -> c) -> b -> a -> c
const C = f => y => x => f(x) (y);


// API


module.exports = C;