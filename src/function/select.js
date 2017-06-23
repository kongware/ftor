"use strict";


/**
 * @name select
 * @note lazy conditional expression
 * @type higher order function
 * @status stable
 * @example

  ???

 */


// (a -> b) -> Boolean -> a -> b
const select = f => g => x => b => b ? f(x) : g(x);


module.exports = select;