"use strict";


/**
 * @name logical and
 * @type short circuiting operator function
 * @example
 *

   and_({}, 1); // 1
   and_(1, {}); // {}
   and_({}, null); // null
   and_(null, {}); // null

 */


// a -> b -> a|b
const and = y => x => x && y;


// (a, b) -> a|b
const and_ = (x, y) => x && y;


// API


module.exports = {and, and_};