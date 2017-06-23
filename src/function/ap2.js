"use strict";


/**
 * @name binary apply
 * @note applicative
 * @type higher order function
 * @status stable
 * @example

  ???

 */


// (r1 -> a -> b) -> (r1 -> r2 -> a) -> r1 -> r2 -> b
const ap2 = f => g => x => y => f(x) (g(x) (y));


// API


module.exports = ap2;