"use strict";


/**
 * @name greater than
 * @type first order function
 * @status stable
 * @example

   const lt = x => y => x < y;
   lt(3) (2); // true

 */


// a -> a -> Boolean
const lt = x => y => x < y;


// API


module.exports = lt;