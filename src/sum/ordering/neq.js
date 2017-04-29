"use strict";


/**
 * @name not equal
 * @note commutative
 * @type first order function
 * @status stable
 * @example

   @see eq

 */


// Ordering -> Ordering -> Boolean
const neq = ({tag: x}) => ({tag: y}) => x !== y;


// API


module.exports = neq;