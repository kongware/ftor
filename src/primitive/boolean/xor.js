"use strict";


/**
 * @name logical xor
 * @note logical non-equality; short circuiting; commutative
 * @type associative binary operation (semigroup)
 * @status stable
 * @example

   const xor = x => y => x ? !y : y;

   xor(true) (true); // false
   xor(true) (false); // true
   xor(false) (true); // true
   xor(false) (false); // false

 */


// Boolean -> Boolean -> Boolean
const xor = x => y => x ? !y : y;


// API


module.exports = xor;