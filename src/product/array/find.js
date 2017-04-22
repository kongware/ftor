"use strict";


/**
 * @name find
 * @note exits prematurely; i is optional
 * @type higher order function
 * @example

   ?
 
 */


// (a -> Boolean) -> [a] -> a
const find = f => xs => xs.find((x, i) => f(x, i));


// API


module.exports = find;