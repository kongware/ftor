"use strict";


/**
 * @name variadic composition
 * @type higher order function
 * @example

   const C = (...fs) => g => x => fs.reduceRight((acc, f) => f(acc), g(x));
   const C_ = (...fs) => x => fs.reduceRight((acc, f) => f(acc), x);

   const inc = x => x + 1;
   const sqr = x => x * x;
   
   C(sqr, inc, inc, inc) (inc) (1); // 25
   C_(sqr, inc, inc, inc, inc) (1); // 25

 */


// (Function) -> (a -> b) -> a -> c
const C = (...fs) => g => x => fs.reduceRight((acc, f) => f(acc), g(x));


// (Function) -> a -> b
const C_ = (...fs) => x => fs.reduceRight((acc, f) => f(acc), x);


// (Function) -> (a -> b -> c) -> a -> b -> d
const C2 = (...fs) => g => x => y => fs.reduceRight((acc, f) => f(acc), g(x) (y));


// (Function) -> a -> b -> c
const C2_ = (...fs) => x => y => fs.slice(0, -1).reduceRight((acc, f) => f(acc), fs[fs.length - 1](x) (y));


// (Function) -> (a -> b -> c -> d) -> a -> b -> c -> e
const C3 = (...fs) => g => x => y => z => fs.reduceRight((acc, f) => f(acc), g(x) (y) (z));


// (Function) -> a -> b -> c -> e
const C3_ = (...fs) => x => y => z => fs.slice(0, -1).reduceRight((acc, f) => f(acc), fs[fs.length - 1](x) (y) (z));


// API


module.exports = {C, C_, C2, C2_, C3, C3_};