"use strict";


/**
 * @name fold left
 * @type higher order function
 * @example
 *

   const triplet = Triplet(1, 2, 3);
   triplet(foldl((x, y) => x + y) (0)); // 6

 */


// (a -> b -> a) -> a -> [b] -> a
const foldl = f => acc => (...args) => args.reduce(f, acc);


// API


module.exports = foldl;