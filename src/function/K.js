"use strict";


/**
 * @name constant
 * @note monadic "of" of the function instance
 * @type first order function
 * @status stable
 * @example

  const K = x => _ => x;
  const True = K(true);

  True(false); // true

 */


// a -> b => a
const K = x => y => x;


// a -> b -> b
const K_ = x => y => y;


// API


module.exports = {K, K_};