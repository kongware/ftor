"use strict";


/**
 * @name conditional function
 * @note lazy conditional expression
 * @type higher order function
 * @status stable
 * @example

  ???

 */


// (a -> b) -> Boolean -> a -> b
const condf = f => x => b => b ? f(x) : x;


module.exports = condf;