"use strict";


/**
 * @name Tuple from Array
 * @type higher order function
 * @example

   const add = (x, y) => x + y;
   const fromArray = args => f => f(...args);
   
   fromArray([1, 2]) (add); // 3

 */

// [*] -> ((*) -> b) -> b
const fromArray = args => f => f(...args);


// API


module.exports = fromArray;