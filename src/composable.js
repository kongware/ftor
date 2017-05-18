"use strict";


/**
 * @name composable
 * @type higher order function
 * @status stable
 * @example

  const B_ = (...fs) => x => fs.reduceRight((acc, f) => f(acc), x);
  const composable = f => (...args) => x => f(...args, x);

  const reduce = (f, acc, xs) => xs.reduce((acc, x) => f(acc) (x), acc);
  const add = x => y => x + y;
  const sqr = x => x * x;

  B_(sqr, composable(reduce) (add, 0)) ([1, 2, 3]); // 36

 */


// (((*), a) -> b) -> (*) -> a -> b
const composable = f => (...args) => x => f(...args, x);


// API


module.exports = composable;