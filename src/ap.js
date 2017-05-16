"use strict";


/**
 * @name apply
 * @note applicative
 * @type higher order function
 * @status stable
 * @example

  ?

 */


// (r -> a -> b) -> (r -> a) -> r -> b
const ap = f => g => x => f(x) (g(x));


// API


module.exports = ap;