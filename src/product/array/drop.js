"use strict";


/**
 * @name drop
 * @type operator function
 * @example

   ?
 
 */


// Number -> [a] -> [a]
const drop = n => xs => xs.slice(n);


// API


module.exports = drop;