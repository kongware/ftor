"use strict";


/**
 * @name case of
 * @type short circuiting operator function
 * @example
 *

   @see pmatch

 */


// (a -> b) -> a -> Boolean -> b|null
const caseOf = f => y => x => (x === true || null) && f(y);


// ((a -> b), a) -> Boolean -> b|null
const caseOf = (f, y) => x => (x === true || null) && f(y);


// API


module.exports = {caseOf, caseOf_};