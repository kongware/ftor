"use strict";


/**
 * @name fold right 1
 * @note throws an error when list is empty; i is optional
 * @type higher order function
 * @example

   ?
 
 */


// (a -> a -> a) -> [a] -> a
const foldr1 = f => xs => xs.reduceRight((acc, x, i) => f(x) (acc, i));


// API


module.exports = foldr1;