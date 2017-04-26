"use strict";


/**
 * @name logical and
 * @note short circuiting; non-commutative
 * @type associative binary operation (semigroup)
 * @status stable
 * @example

   const and = x => y => x && y;

   and(false) ("foo"); // false
   and("foo") (false); // false
   and(true) ("foo"); // "foo"
   and("foo") (true); // true

 */


// a -> b -> a|b
const and = x => y => x && y;


// a -> b -> a|b
const and_ = y => x => x && y;


// API


module.exports = {and, and_};