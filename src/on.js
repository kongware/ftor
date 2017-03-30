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


// ((b -> b -> c), (a -> b), a) -> a -> c
const on_ = (f, g, x) => y => f(g(x)) (g(y));


// (((b, b) -> c), (a -> b), a) -> a -> c
const on__ = (f, g, x) => y => f(g(x), g(y));


// API


module.exports = {on, on_, on__};