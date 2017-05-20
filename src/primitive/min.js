"use strict";


/**
 * @name minimal
 * @type first order function
 * @status stable
 * @example

  @see ./max

 */


// a -> a -> a
const min = x => y => x < y ? x : y;


// API


module.exports = min;