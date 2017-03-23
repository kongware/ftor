"use strict";


/**
 * @name applicative apply
 * @type function (primitive combinator)
 * @example
 *

   ?

 */


// (a -> b) -> a -> b
const ap = f => g => x => f(x) (g(x));


// API


module.exports = ap;