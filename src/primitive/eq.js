"use strict";


/**
 * @name equal
 * @type first order function
 * @example

   ?

 */


// a -> a -> Boolean
const eq = x => y => Object.is(x, y);


// API


module.exports = eq;