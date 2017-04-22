"use strict";


/**
 * @name tail
 * @type operator function
 * @example

   ?
 
 */


// [a] -> [a]
const tail = xs => xs.slice(1);


// API


module.exports = tail;