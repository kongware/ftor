"use strict";


/**
 * @name fold left 1
 * @note throws an error when list is empty; i is optional
 * @type higher order function
 * @example

   ?
 
 */


// (a -> a -> a) -> [a] -> a
const foldl1 = f => xs => xs.reduce((acc, x, i) => f(acc) (x, i));


// API


module.exports = foldl1;