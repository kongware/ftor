"use strict";


/**
 * @name find index
 * @note exits prematurely; i is optional
 * @type higher order function
 * @example

   ?
 
 */


// (a -> Boolean) -> [a] -> Number
const findIndex = f => xs => xs.findIndex((x, i) => f(x, i));


// API


module.exports = findIndex;