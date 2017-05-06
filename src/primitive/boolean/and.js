"use strict";


/**
 * @name and
 * @note logical conjunction; short circuiting; performs an implicit type coercion
 * @type associative binary operation (semigroup)
 * @status stable
 * @example

   const and = x => y => x && y;

   and(true) (true); // true
   and(true) (false); // false

   and(1) (2); // 2
   and(0) (2); // 0

 */


// a -> a -> a
const and = x => y => x && y;


// a -> a -> a
const and_ = y => x => x && y;


// API


module.exports = {and, and_};