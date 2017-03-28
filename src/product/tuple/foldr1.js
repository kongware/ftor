"use strict";


/**
 * @name fold right without accumulator
 * @type higher order function
 * @example
 *

   const triplet = Triplet(1, 2, 3);
   triplet(foldr1((x, y) => x - y)); // 2 (1 - (2 - 3))

 */


// (a -> a -> a) -> [a] -> a
const foldr1 = foldr1 = f => (...args) => args.reduceRight((acc, x) => f(x, acc));


// API


module.exports = foldr1;