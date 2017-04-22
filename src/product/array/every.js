"use strict";


/**
 * @name every
 * @note exits prematurely; i is optional
 * @type higher order function
 * @example

   ?
 
 */


// (a -> Boolean) -> [a] -> Boolean
const every = pred => xs => xs.every((x, i) => pred(x, i));


// API


module.exports = every;