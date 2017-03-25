"use strict";


/**
 * @name monadic chain
 * @type higher order function
 * @example
 *

   ?

 */


// (a -> r -> b) -> (r -> a) -> r -> b
const chain = f => g => x => f(g(x)) (x);


// API


module.exports = chain;