"use strict";


/**
 * @name logical and
 * @note commutative, short circuiting
 * @type operator function
 * @example

   const and = y => x => x && y;
   and("foo") ("bar"); // "foo"

 */


// a -> a -> a
const and = x => y => x && y;


// API


module.exports = and;