"use strict";


/**
 * @name join
 * @note monadic
 * @type higher order function
 * @status stable
 * @example

  ??

 */


// (r -> r -> a) -> r -> a
const join = f => x => f(x) (x);


// API


module.exports = join;