"use strict";


/**
 * @name identity
 * @type higher order function
 * @example
 *

   const o = {};
   I(o) === o; // true

 */


// a -> a
const I = x => x;


// API


module.exports = I;