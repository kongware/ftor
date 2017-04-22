"use strict";


/**
 * @name fold left
 * @note i is optional
 * @type higher order function
 * @example

   ?
 
 */


// (a -> b -> a) -> a -> [b] -> a
const foldl = f => acc => xs => xs.reduce((acc, x, i) => f(acc) (x, i), acc);


// API


module.exports = foldl;