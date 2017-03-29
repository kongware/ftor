"use strict";


/**
 * @name Integer
 * @type unary constructor
 * @example
 *

   Int(123); // 123
   Int("1"); // 1
   Int("a"); // undefined
   Int([1]); // undefined

 */


// Number -> Number|undefined
const Int = n => n % 1 === 0 ? +n : undefined;


// API


module.exports = Int;