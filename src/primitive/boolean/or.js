"use strict";


/**
 * @name logical or
 * @note short circuiting
 * @type associative binary operation (semigroup)
 * @status stable
 * @example

   const or = x => y => x || y;

   or(false) ("foo"); // "foo"
   or("foo") (false); // "foo"
   or(true) ("foo"); // true
   or("foo") (true); // "foo"

 */


// a -> a -> a
const or = x => y => x || y;


// a -> a -> a
const or_ = y => x => x || y;


// API


module.exports = {or, or_};