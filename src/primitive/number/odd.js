"use strict";


/**
 * @name odd
 * @type first order function
 * @example

   ?

 */


// Number -> Boolean
const odd = x => Math.floor(x) === x && x & 1 === 1;


// API


module.exports = odd;