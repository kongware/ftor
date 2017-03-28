"use strict";


/**
 * @name logical or
 * @type short circuiting operator function
 * @example
 *

   or_({}, 1); // {}
   or_(1, {}); // 1
   or_({}, null); // {}
   or_(null, {}); // {}

 */


// a -> b -> a|b
const or = y => x => x || y;


// (a, b) -> a|b
const or_ = (x, y) => x || y;


// API


module.exports = {or, or_};