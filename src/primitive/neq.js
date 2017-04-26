"use strict";


/**
 * @name not equal
 * @type first order function
 * @example

   ?

 */


// a -> a -> Boolean
const neq = x => y => !Object.is(x, y);


// API


module.exports = neq;