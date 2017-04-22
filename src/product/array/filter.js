"use strict";


/**
 * @name filter
 * @note i is optional
 * @type higher order function
 * @example

   ?
 
 */


// (a -> Boolean) -> [a] -> [a]
const filter = pred => xs => xs.filter((x, i) => pred(x, i));


// API


module.exports = filter;