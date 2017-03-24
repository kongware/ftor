"use strict";


/**
 * @name logical and
 * @type short circuiting operator function
 * @example
 *

   and({}) (1); // {}
   and(1) ({}); // 1
   and({}) (null); // null
   and(null) ({}); // null

 */


// a -> b -> a|b
const and = y => x => x && y;


// (a -> b) -> a|b
const and_ = (x, y) => x && y;


// API


module.exports = {and, and_};