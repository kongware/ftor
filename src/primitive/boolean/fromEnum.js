"use strict";


/**
 * @name from enumeration
 * @note works with truthy/falsy values as well
 * @type first order function
 * @status stable
 * @example

   const fromEnum = x => x ? 1 : 0;

   fromEnum(false); // 0
   fromEnum(true); // 1

   // implicit type coercion:
   
   fromEnum(""); // 0
   fromEnum("foo"); // 1

 */


// a -> Number
const fromEnum = x => x ? 1 : 0;


// API


module.exports = fromEnum;