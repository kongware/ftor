"use strict";


/**
 * @name logical xor
 * @note short circuiting; commutative
 * @type operator function
 * @example

   const xor = default_ => x => y => !x === !y ? default_ : x || y;

   xor("default") ("foo") (false); // "foo"
   xor("default") (false) ("foo"); // "foo"
   xor("default") ("foo") (true); // "default"
   xor("default") (true) ("foo"); // "default"

 */


// a -> b -> c -> a|b|c
const xor = default_ => x => y => !x === !y ? default_ : x || y;


// API


module.exports = xor;