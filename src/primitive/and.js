"use strict";


/**
 * @name and
 * @note logical conjunction; short circuiting; works with all primitives
 * @type first order function
 * @status stable
 * @example

  const and = x => y => x && y;

  and(true) (true); // true
  and(1) (2); // 2
  and(0) (2); // 0

 */


// a -> a -> a
const and = x => y => x && y;


// a -> a -> a
const and_ = y => x => x && y;


// API


module.exports = {and, and_};