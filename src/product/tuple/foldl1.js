"use strict";


/**
 * @name fold left without accumulator
 * @type higher order function
 * @example
 *

   const triplet = Triplet(1, 2, 3);
   triplet(foldl1((x, y) => x + y); // 6

 */


// (a -> a -> a) -> [a] -> a
const foldl1 = f => (...args) => args.reduce(f);


// API


module.exports = foldl1;