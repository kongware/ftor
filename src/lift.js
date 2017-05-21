"use strict";


/**
 * @name lift
 * @note applicative
 * @type higher order function
 * @status stable
 * @example

  ??

 */


// (b -> c -> d) -> (a -> b) -> (a -> c) -> a -> d
const lift = f => g => h => x => f(g(x)) (h(x));


// API


module.exports = lift;