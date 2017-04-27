"use strict";


/**
 * @name logical or
 * @note short circuiting
 * @type associative binary operation (semigroup)
 * @status stable
 * @example

   const or = x => y => x || y;

   or("foo") (""); // "foo"
   or("") ("bar"); // "bar"
   or("foo") ("bar"); // "foo"

 */


// a -> a -> a
const or = x => y => x || y;


// a -> a -> a
const or_ = y => x => x || y;


// API


module.exports = {or, or_};