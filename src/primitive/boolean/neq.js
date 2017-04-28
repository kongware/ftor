"use strict";


/**
 * @name not equal
 * @note non-boolean values are allowed
 * @type first order function
 * @status stable
 * @example

   @see eq

 */


// a -> a -> Boolean
const neq = x => y => !!x !== !!y;


// API


module.exports = eq;