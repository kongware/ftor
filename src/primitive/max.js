"use strict";


/**
 * @name maximal
 * @type operator function
 * @example

   ?

 */


// a -> a -> a
const max = x => y => x > y ? x : y;


// API


module.exports = max;