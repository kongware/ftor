"use strict";


/**
 * @name not equal
 * @type operator function
 * @example

   ?

 */


// a -> a -> Boolean
const neq = x => y => !Object.is(x, y);


// API


module.exports = neq;