"use strict";


/**
 * @name logical and
 * @type short circuiting operator function
 * @example
 *

   and({}) (false); // false

 */


// a -> b -> a|b
const and = y => x => x && y;


// API


module.exports = and;