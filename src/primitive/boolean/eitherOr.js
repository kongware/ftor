"use strict";


/**
 * @name either or
 * @note logical inequality with default value; short circuiting; commutative
 * @type first order function
 * @status stable
 * @todo reconsider name
 * @example

   const eitherOr = default_ => x => y => !x === !y ? default_ : x || y;

   eitherOr("default") ("foo") (""); // "foo"
   eitherOr("default") ("") ("bar"); // "bar"
   eitherOr("default") ("foo") ("bar"); // "default"
   eitherOr("default") ("") (""); // "default"

 */


// a -> a -> a
const eitherOr = default_ => x => y => !x === !y ? default_ : x || y;


// API


module.exports = eitherOr;