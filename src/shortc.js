"use strict";


/**
 * @name short circuit
 * @type short circuiting operator function
 * @example
 *

   @see pmatch

 */


// (a -> b) -> a -> Boolean -> b|Boolean
const shortc = f => y => x => x === true && f(y);


// ((a -> b), a) -> Boolean -> b|Boolean
const shortc_ = (f, y) => x => x === true && f(y);


// API


module.exports = {shortc, shortc_};