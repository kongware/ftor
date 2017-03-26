"use strict";


/**
 * @name last value
 * @type operator function
 * @example
 *

   last([1, 2, 3]); // 3
 
 */


// [a] -> a
const last = xs => xs[xs.length - 1];


// API


module.exports = last;