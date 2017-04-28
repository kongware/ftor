"use strict";


/**
 * @name predecessor
 * @note works with truthy/falsy values as well
 * @type first order function
 * @status stable
 * @example

   @see succ

 */


// a -> Boolean|null
const pred = x => x ? false : null;


// API


module.exports = pred;