"use strict";


/**
 * @name identity
 * @type function (primitive combinator)
 * @example
 *

   const o = {};
   I(o) === o; // true

 */


// a -> a
const I = x => x;


module.exports = I;