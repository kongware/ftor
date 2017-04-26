"use strict";


/**
 * @name length
 * @type first order function
 * @example

   const Triple = (x, y, z) => f => f(x, y, z);
   const len = (...args) => args.length;

   Triple(1, 2, 3) (len); // 3

 */


// (*) -> Number
const len = (...args) => args.length;


// API


module.exports = len;