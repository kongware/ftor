"use strict";


/**
 * @name dove combinator (function composition on the 2nd argument)
 * @type higher order function
 * @example
 *

   ?

 */


// ((a -> c -> d) -> a -> (b -> c) -> b -> d
const D = f => x => g => y => f(x) (g(y));


// API


module.exports = D;