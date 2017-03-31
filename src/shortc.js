"use strict";


/**
 * @name short circuit
 * @type short circuiting operator function
 * @example
 *

   @see pmatch

 */


// (a -> b) -> a -> Boolean -> b|null
const shortc = f => y => x => (x === true || null) && f(y);


// ((a -> b), a) -> Boolean -> b|null
const shortc_ = (f, y) => x => (x === true || null) && f(y);


// API


module.exports = {shortc, shortc_};