"use strict";


/**
 * @name even
 * @type first order function
 * @example

   ?

 */


// Number -> Boolean
const even = x => Math.floor(x) === x && (x & 1) === 0;


// API


module.exports = even;