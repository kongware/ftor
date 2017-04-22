"use strict";


/**
 * @name take
 * @type operator function
 * @example

   ?
 
 */


// Number -> [a] -> [a]
const take = n => xs => xs.slice(0, n);


// API


module.exports = take;