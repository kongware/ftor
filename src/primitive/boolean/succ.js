"use strict";


/**
 * @name successor
 * @note works with truthy/falsy values as well
 * @type first order function
 * @status stable
 * @example

   const succ = x => x ? null : true;

   succ(false); // true
   succ(true); // null

 */


// a -> Boolean|null
const succ = x => x ? null : true;


// API


module.exports = succ;