"use strict";


/**
 * @name some
 * @note exits prematurely; i is optional
 * @type higher order function
 * @example

   ?
 
 */


// (a -> Boolean) -> [a] -> Boolean
const some = pred => xs => xs.some((x, i) => pred(x, i));


// API


module.exports = some;