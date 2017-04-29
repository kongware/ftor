"use strict";


/**
 * @name minimal value
 * @note works with all types through explicit type cast
 * @type first order function
 * @status stable
 * @example

   const min = x => y => !!x <= !!y ? x : y;

   min(false) (true); // false
   min("foo") (""); // ""
   min("foo") ("bar"); // "foo"


 */


// a -> a -> a
const min = x => y => !!x <= !!y ? x : y;


// API


module.exports = min;