"use strict";


/**
 * @name maximal bound
 * @type operator function
 * @example

   ?

 */


// Number -> String
const maxBound = n => Array(n).fill("\u{10FFFF}").join("");


// API


module.exports = maxBound;