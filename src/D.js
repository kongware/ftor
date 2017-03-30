"use strict";


/**
 * @name dove combinator (binary function composition)
 * @type higher order function
 * @example
 *

   ?

 */


// ((a -> c -> d) -> a -> (b -> c) -> b -> d
const D = f => x => g => y => f(x) (g(y));


// (((a -> c -> d), a, (b -> c)) -> b -> d
const D_ = (f, x, g) => y => f(x) (g(y));


// ((((a, c) -> d), a, (b -> c)) -> b -> d
const D__ = (f, x, g) => y => f(x, g(y));


// API


module.exports = {D, D_, D__};