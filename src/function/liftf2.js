"use strict";


/**
 * @name lift function 2
 * @note both applicative and monadic values
 * @type higher order function
 * @status stable
 * @example

  ???

 */


// (b -> c -> d) -> (a -> b) -> (a -> c) -> a -> d
const liftf2 = f => g => h => x => f(g(x)) (h(x));


// API


module.exports = liftf2;