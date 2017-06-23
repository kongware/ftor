"use strict";


/**
 * @name composition
 * @note functorial
 * @type higher order function
 * @status stable
 * @example

  const comp = (...fs) => g => x => fs.reduceRight((acc, f) => f(acc), g(x));
  const comp_ = (...fs) => x => fs.reduceRight((acc, f) => f(acc), x);

  const inc = x => x + 1;
  const sqr = x => x * x;

  comp(sqr, inc, inc, inc) (inc) (1); // 25
  comp_(sqr, inc, inc, inc, inc) (1); // 25

 */


// [(* -> *)] -> (* -> *) -> * -> *
const comp = (...fs) => g => x => fs.reduceRight((acc, f) => f(acc), g(x));


// [(* -> *)] -> * -> *
const comp_ = (...fs) => x => fs.reduceRight((acc, f) => f(acc), x);


// [(* -> *)] -> (* -> * -> *) -> * -> * -> *
const comp2 = (...fs) => g => x => y => fs.reduceRight((acc, f) => f(acc), g(x) (y));


// [(* -> *)] -> * -> * -> *
const comp2_ = (...fs) => x => y => fs.slice(0, -1).reduceRight((acc, f) => f(acc), fs[fs.length - 1](x) (y));


// [(* -> *)] -> (* -> * -> * -> *) -> * -> * -> * -> *
const comp3 = (...fs) => g => x => y => z => fs.reduceRight((acc, f) => f(acc), g(x) (y) (z));


// [(* -> *)] -> * -> * -> * -> *
const comp3_ = (...fs) => x => y => z => fs.slice(0, -1).reduceRight((acc, f) => f(acc), fs[fs.length - 1](x) (y) (z));


// API


module.exports = {comp, comp_, comp2, comp2_, comp3, comp3_};