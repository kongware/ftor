"use strict";


/**
 * @name greater than or equal
 * @type first order function
 * @status stable
 * @example

   const lte = x => y => x <= y;
   lte(3) (3); // true

 */


// a -> a -> Boolean
const lte = x => y => x <= y;


// API


module.exports = lte;