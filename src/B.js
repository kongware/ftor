"use strict";


/**
 * @name bluebird combinator (function composition)
 * @type higher order function
 * @example

   const inc = x => x + 1;
   const sqr = x => x * x;
   
   B(sqr, inc, inc, inc) (inc) (1); // 25

 */


// (Function) -> (a -> b) -> a -> ?
const B = (...fs) => g => x => fs.reduceRight((acc, f) => f(acc), g(x));


// (Function) -> a -> ?
const B_ = (...fs) => x => fs.reduceRight((acc, f) => f(acc), x);


// (Function) -> (a -> b -> c) -> a -> b -> ?
const B2 = (...fs) => g => x => y => fs.reduceRight((acc, f) => f(acc), g(x) (y));


// (Function) -> (a -> b -> c -> d) -> a -> b -> c -> ?
const B3 = (...fs) => g => x => y => z => fs.reduceRight((acc, f) => f(acc), g(x) (y) (z));


// API


module.exports = {B, B_, B2, B3};