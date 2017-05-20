"use strict";


/**
 * @name or
 * @note logical disjunction; short circuiting; works with all primitives
 * @type first order function
 * @status stable
 * @example

  const or = x => y => x || y;

  or(false) (true); // true
  or(0) (2); // 2
  or(1) (2); // 1

 */


// a -> a -> a
const or = x => y => x || y;


// a -> a -> a
const or_ = y => x => x || y;


// API


module.exports = {or, or_};