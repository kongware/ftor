"use strict";


/**
 * @name Tuple to Array
 * @type first order function
 * @example

   const Triple = (x, y, z) => f => f(x, y, z);
   const toArray = (...args) => args;

   Triple(1, "a", true) (toArray); // [1, "a", true]

 */


// (*) -> [*]
const toArray = (...args) => args;


// API


module.exports = toArray;