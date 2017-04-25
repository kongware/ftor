"use strict";


/**
 * @name div
 * @type operator function
 * @example

   ?

 */


// Number -> Number -> Number
const div = x => y => x / y;


// Number -> Number -> Number
const div_ = y => x => x / y;


// API


module.exports = {div, div_};