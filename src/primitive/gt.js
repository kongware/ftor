"use strict";


/**
 * @name greater than
 * @type first order function
 * @status stable
 * @example

   const gt = x => y => x > y;
   gt(3) (2); // true

 */


// a -> a -> Boolean
const gt = x => y => x > y;


// API


module.exports = gt;