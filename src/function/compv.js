"use strict";


/**
 * @name composition of variadic and multi-argument functions
 * @type higher order function
 * @status stable
 * @example

  ???

 */


// [(* -> *)] -> (* -> * -> *) -> * -> * -> *
const compv = (...fs) => g => (...args) => fs.reduceRight((acc, f) => f(acc), g(...args));


// [(* -> *)] -> * -> * -> *
const compv_ = (...fs) => (...args) => fs.slice(0, -1).reduceRight((acc, f) => f(acc), fs[fs.length - 1](...args));


// API


module.exports = {compv, compv_};