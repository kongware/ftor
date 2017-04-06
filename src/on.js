"use strict";


/**
 * @name on
 * @type higher order function
 * @example
 *

   ?

 */


// (b -> b -> c) -> (a -> b) -> a -> a -> c
const on = f => g => x => y => f(g(x)) (g(y));


// API


module.exports = on;