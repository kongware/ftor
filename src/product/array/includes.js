"use strict";


/**
 * @name includes
 * @note exits prematurely
 * @type operator function
 * @example

   ?
 
 */


// a -> [a] -> Boolean
const includes = x => xs => xs.includes(x);


// API


module.exports = includes;