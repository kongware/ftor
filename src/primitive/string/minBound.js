"use strict";


/**
 * @name minimal bound
 * @type operator function
 * @example

   ?

 */


// Number -> String
const minBound = n => Array(n).fill("\u{0}").join("");


// API


module.exports = minBound;