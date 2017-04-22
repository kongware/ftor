"use strict";


/**
 * @name apply
 * @note applicative
 * @type higher order function
 * @example

   const B_ = (...fs) => x => fs.reduceRight((acc, f) => f(acc), x);
   const B2_ = (...fs) => x => y => fs.slice(0, -1).reduceRight((acc, f) => f(acc), fs[fs.length - 1](x) (y));
   const ap = f => g => x => f(x) (g(x));

   const inc = x => x + 1;
   const dbl = x => x * 2;
   const sqr = x => x * x;

   const triple = x => y => z => [x, y, z];

   B2_(ap, ap) (B_(triple, inc)) (dbl) (sqr) (10); // [11, 20, 100]

 */


// (r -> a -> b) -> (r -> a) -> r -> b
const ap = f => g => x => f(x) (g(x));


// API


module.exports = ap;