"use strict";


/**
 * @name condition
 * @note lazy conditional expression
 * @type first order function
 * @status stable
 * @example

   ?

 */


// a -> a -> Boolean -> a
const cond = x => y => p => p ? x : y;


// Boolean -> a -> a -> a
const cond_ = p => x => y => p ? x : y;


module.exports = {cond, cond_};