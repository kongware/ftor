"use strict";


/**
 * @name not equal
 * @note works with all types through explicit type cast
 * @type first order function
 * @status stable
 * @example

   @see eq

 */


// a -> a -> Boolean
const neq = x => y => !!x !== !!y;


// API


module.exports = eq;