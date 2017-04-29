"use strict";


/**
 * @name maximal value
 * @note works with all types through explicit type cast
 * @type first order function
 * @status stable
 * @example

   const max = x => y => !!x >= !!y ? x : y;

   max(false) (true); // true
   max("") ("foo"); // "foo"
   max("foo") ("bar"); // "foo"

 */


// a -> a -> a
const max = x => y => !!x >= !!y ? x : y;


// API


module.exports = max;