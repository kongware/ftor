"use strict";


/**
 * @name constant
 * @note monadic "of" of the function instance
 * @type higher order function
 * @example
 *

   const True = K(true);
   True(false); // true

 */


// a -> b => a
const K = x => _ => x;


// API


module.exports = K;