"use strict";


/**
 * @name Tuple from Array
 * @type higher order function
 * @example

   fromArray([1, 2]) ((x, y) => x + y); // 3

 */

// [*] -> ((*) -> b) -> b
const fromArray = args => f => f(...args);


// API


module.exports = fromArray;