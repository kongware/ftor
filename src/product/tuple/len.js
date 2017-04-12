"use strict";


/**
 * @name length
 * @type operator function
 * @example

   Triplet(1, 2, 3) (len); // 3

 */


// (*) -> Number
const len = (...args) => args.length;


// API


module.exports = len;