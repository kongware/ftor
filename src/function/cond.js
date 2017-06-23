"use strict";


/**
 * @name condition
 * @note lazy conditional expression
 * @type first order function
 * @status stable
 * @example

  ???

 */


// a -> a -> Boolean -> a
const cond = x => y => b => b ? x : y;


// Boolean -> a -> a -> a
const cond_ = b => x => y => b ? x : y;


module.exports = {cond, cond_};