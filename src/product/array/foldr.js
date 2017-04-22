"use strict";


/**
 * @name fold right
 * @type higher order function; i is optional
 * @example

   ?
 
 */


// (a -> b -> b) -> b -> [a] -> b
const foldr = f => acc => xs => xs.reduceRight((acc, x, i) => f(x) (acc, i), acc);


// API


module.exports = foldr;