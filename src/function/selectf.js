"use strict";


/**
 * @name select function
 * @note lazy conditional expression
 * @type higher order function
 * @status stable
 * @example

  ???

 */


// (a -> b) -> Boolean -> a -> b
const selectf = f => g => x => b => b ? f(x) : g(x);


module.exports = selectf;