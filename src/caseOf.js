"use strict";


/**
 * @name case of
 * @type short circuiting higher order function
 * @example
 *

   @see pmatch

 */


// (a -> b) -> a -> Boolean -> b|null
const caseOf = f => x => y => (y === true || null) && f(x);


// API


module.exports = caseOf;