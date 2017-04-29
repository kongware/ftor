"use strict";


/**
 * @name lower than or equal
 * @note works with all types through explicit type cast
 * @type first order function
 * @status stable
 * @example

   const lte = x => y => !!x <= !!y;

   lte(false) (true); // true
   lte("foo") (""); // false
   lte("foo") ("bar"); // true

 */


// a -> a -> Boolean
const lte = x => y => !!x <= !!y;


// a -> a -> Boolean
const lte_ = y => x => !!x <= !!y;


// API


module.exports = {lte, lte_};