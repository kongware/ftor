"use strict";


/**
 * @name not equal
 * @note commutative
 * @type first order function
 * @status stable
 * @example

  @see ./eq

 */


// a -> a -> Boolean
const neq = x => y => !Object.is(x, y);


// API


module.exports = neq;