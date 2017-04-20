"use strict";


/**
 * @name bluebird combinator (function composition / functor)
 * @type higher order function
 * @example

   const B = (...fs) => g => x => fs.reduceRight((acc, f) => f(acc), g(x));
   const B_ = (...fs) => x => fs.reduceRight((acc, f) => f(acc), x);

   const inc = x => x + 1;
   const sqr = x => x * x;
   
   B(sqr, inc, inc, inc) (inc) (1); // 25
   B_(sqr, inc, inc, inc, inc) (1); // 25

 */


// (Function) -> (a -> b) -> a -> c
const B = (...fs) => g => x => fs.reduceRight((acc, f) => f(acc), g(x));


// (Function) -> a -> b
const B_ = (...fs) => x => fs.reduceRight((acc, f) => f(acc), x);


// (Function) -> (a -> b -> c) -> a -> b -> d
const B2 = (...fs) => g => x => y => fs.reduceRight((acc, f) => f(acc), g(x) (y));


// (Function) -> a -> b -> c
const B2_ = (...fs) => x => y => fs.slice(0, -1).reduceRight((acc, f) => f(acc), fs[fs.length - 1](x) (y));


// (Function) -> (a -> b -> c -> d) -> a -> b -> c -> e
const B3 = (...fs) => g => x => y => z => fs.reduceRight((acc, f) => f(acc), g(x) (y) (z));


// (Function) -> a -> b -> c -> e
const B3_ = (...fs) => x => y => z => fs.slice(0, -1).reduceRight((acc, f) => f(acc), fs[fs.length - 1](x) (y) (z));


// API


module.exports = {B, B_, B2, B2_, B3, B3_};