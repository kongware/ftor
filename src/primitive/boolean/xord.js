"use strict";


/**
 * @name logical xor default
 * @note short circuiting; commutative
 * @type first order function
 * @status stable
 * @example

   const xord = default_ => x => y => !x === !y ? default_ : x || y;

   xord("default") ("foo") (false); // "foo"
   xord("default") (false) ("foo"); // "foo"
   xord("default") ("foo") (true); // "default"
   xord("default") (true) ("foo"); // "default"

 */


// a -> a -> a -> a
const xord = default_ => x => y => !x === !y ? default_ : x || y;


// API


module.exports = xord;