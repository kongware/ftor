"use strict";


/**
 * @name logical or
 * @type short circuiting operator function
 * @example
 *

   or(false) ({}); // {}

 */


// a -> b -> a|b
const or = y => x => x || y;


// API


module.exports = or;