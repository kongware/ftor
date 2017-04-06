"use strict";


/**
 * @name starling combinator (applicative lift on functions)
 * @type higher order function
 * @example
 *

   ?

 */


// (b -> c -> d) -> (a -> b) -> (a -> c) -> a -> d
const S = f => g => h => x => f(g(x)) (h(x));


// API


module.exports = S;