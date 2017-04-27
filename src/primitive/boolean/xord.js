"use strict";


/**
 * @name logical xor default
 * @note short circuiting; commutative
 * @type first order function
 * @status stable
 * @example

   const xord = default_ => x => y => !x === !y ? default_ : x || y;

   xord("default") ("foo") (""); // "foo"
   xord("default") ("") ("bar"); // "bar"
   xord("default") ("foo") ("bar"); // "default"
   xord("default") ("foo") ("bar"); // "default"

 */


// a -> a -> a -> a
const xord = default_ => x => y => !x === !y ? default_ : x || y;


// API


module.exports = xord;