"use strict";


/**
 * @name for each
 * @note performs side effects!!!
 * @type higher order function
 * @example

   ?
 
 */


// ?
const forEach = f => xs => xs.forEach((x, i, xs) => f(x, i, xs));


// API


module.exports = forEach;