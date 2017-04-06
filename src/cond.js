"use strict";


/**
 * @name eager, composable conditional operator
 * @type operator function
 * @example
 *

   cond(x % 1 === 0) (x) (Math.floor(x)) (2.1); // 2

 */


// Boolean -> a -> a -> a
const cond = b => y => x => b ? x : y;


// API


module.exports = cond;