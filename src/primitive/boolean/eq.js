"use strict";


/**
 * @name equal
 * @note works with all types through explicit type cast; commutative
 * @type first order function
 * @status stable
 * @example

   const eq = x => y => !!x === !!y;

   eq(false) (false); // true

   // implicit type coercion:

   eq("foo") ("bar"); // true
   eq("foo") (""); // false

 */


// a -> a -> Boolean
const eq = x => y => !!x === !!y;


// API


module.exports = eq;