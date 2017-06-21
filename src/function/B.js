"use strict";


/**
 * @name composition
 * @note bluebird combinator; functorial
 * @type higher order function
 * @status stable
 * @example

  const B = (...fs) => g => x => fs.reduceRight((acc, f) => f(acc), g(x));
  const B_ = (...fs) => x => fs.reduceRight((acc, f) => f(acc), x);

  const inc = x => x + 1;
  const sqr = x => x * x;

  B(sqr, inc, inc, inc) (inc) (1); // 25
  B_(sqr, inc, inc, inc, inc) (1); // 25

 */


// [(* -> *)] -> (* -> *) -> * -> *
const B = (...fs) => g => x => fs.reduceRight((acc, f) => f(acc), g(x));


// [(* -> *)] -> * -> *
const B_ = (...fs) => x => fs.reduceRight((acc, f) => f(acc), x);


// [(* -> *)] -> (* -> * -> *) -> * -> * -> *
const B2 = (...fs) => g => x => y => fs.reduceRight((acc, f) => f(acc), g(x) (y));


// [(* -> *)] -> * -> * -> *
const B2_ = (...fs) => x => y => fs.slice(0, -1).reduceRight((acc, f) => f(acc), fs[fs.length - 1](x) (y));


// [(* -> *)] -> (* -> * -> * -> *) -> * -> * -> * -> *
const B3 = (...fs) => g => x => y => z => fs.reduceRight((acc, f) => f(acc), g(x) (y) (z));


// [(* -> *)] -> * -> * -> * -> *
const B3_ = (...fs) => x => y => z => fs.slice(0, -1).reduceRight((acc, f) => f(acc), fs[fs.length - 1](x) (y) (z));


// API


module.exports = {B, B_, B2, B2_, B3, B3_};