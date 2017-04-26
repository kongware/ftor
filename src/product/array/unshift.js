"use strict";


/**
 * @name unshift
 * @note destructive operation!!!
 * @type first order function
 * @example

   ?
 
 */


// a -> [a] -> [a]
const unshift = x => xs => (xs.unshift(x), xs);


// [a] -> a -> [a]
const unshift_ = xs => x => (xs.unshift(x), xs);


// API


module.exports = {unshift, unshift_};