"use strict";


/**
 * @name greater than or equal
 * @type first order function
 * @status stable
 * @example

   const gte = x => y => x >= y;
   gte(3) (3); // true

 */


// a -> a -> Boolean
const gte = x => y => x >= y;


// API


module.exports = gte;