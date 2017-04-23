"use strict";


/**
 * @name odd
 * @type operator function
 * @example

   ?

 */


// Number -> Boolean
const odd = x => Math.floor(x) === x && x & 1 === 1;


// API


module.exports = odd;