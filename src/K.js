"use strict";


/**
 * @name constant
 * @note monadic "of" of the function instance
 * @type higher order function
 * @example

   ?

 */


// a -> b => a
const K = x => _ => x;


// a -> b -> b
const K_ = _ => y => y;


// API


module.exports = {K, K_};