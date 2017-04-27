"use strict";


/**
 * @name logical and
 * @note short circuiting
 * @type associative binary operation (semigroup)
 * @status stable
 * @example

   const and = x => y => x && y;

   and("foo") (""); // ""
   and("") ("bar"); // ""
   and("foo") ("bar"); // "bar"

 */


// a -> a -> a
const and = x => y => x && y;


// a -> a -> a
const and_ = y => x => x && y;


// API


module.exports = {and, and_};