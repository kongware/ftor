"use strict";


/**
 * @name logical and
 * @type short circuiting operator function
 * @example

   const and = y => x => x && y;
   and("foo") ("bar"); // "foo"

 */


// a -> a -> a
const and = y => x => x && y;


// API


module.exports = and;