"use strict";


/**
 * @name drop
 * @type first order function
 * @example

   ?
 
 */


// Number -> [a] -> [a]
const drop = n => xs => xs.slice(n);


// API


module.exports = drop;