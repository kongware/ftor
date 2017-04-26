"use strict";


/**
 * @name logical or
 * @note short circuiting; non-commutative
 * @type associative binary operation (semigroup)
 * @status stable
 * @example

   const or = x => y => x || y;

   or(false) ("foo"); // "foo"
   or("foo") (false); // "foo"
   or(true) ("foo"); // true
   or("foo") (true); // "foo"

 */


// a -> b -> a|b
const or = x => y => x || y;


// a -> b -> a|b
const or_ = y => x => x || y;


// API


module.exports = {or, or_};