"use strict";


/**
 * @name last element
 * @note returns undefined for empty lists
 * @type first order function
 * @example

   const last = xs => xs[xs.length - 1];
   last([1, 2, 3]); // 3
 
 */


// [a] -> a
const last = xs => xs[xs.length - 1];


// API


module.exports = last;