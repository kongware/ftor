"use strict";


/**
 * @name fold right
 * @type higher order function
 * @example
 *

   const triplet = Triplet(1, 2, 3);
   triplet(foldr((x, y) => x - y) (0)); // 2 (1 - (2 - (3 - 0)))

 */


// (a -> b -> b) -> b -> [a] -> b
const foldr = f => acc => (...args) => args.reduceRight((acc, x) => f(x, acc), acc);


// API


module.exports = foldr;