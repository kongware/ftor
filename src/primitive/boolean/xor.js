"use strict";


/**
 * @name exclusive or
 * @note logical inequality; performs explicit type coercion; commutative
 * @type associative binary operation (semigroup)
 * @status stable
 * @example

   const xor = x => y => x === y ? false : x ? x : y;

   xor(true) (true); // false
   xor(true) (false); // true
   xor(false) (true); // true
   xor(false) (false); // false
   xor("a") (""); // "a"
   xor("a") ("b"); // false

 */


// Boolean -> Boolean -> Boolean
const xor = x => y => !x === !y ? false : x ? x : y;


// API


module.exports = xor;