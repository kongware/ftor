"use strict";


/**
 * @name maximal bound
 * @type first order function
 * @example

   ?

 */


// Number -> String
const maxBound = n => Array(n).fill("\u{10FFFF}").join("");


// API


module.exports = maxBound;