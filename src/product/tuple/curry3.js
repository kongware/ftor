"use strict";


/**
 * @name curry ternary function
 * @type higher order function
 * @example
 *

   const reduce = (f, acc, xs) => xs.reduce(f, acc);
   const sum = curry(reduce) ((x, y) => x + y) (0);
   sum([1, 2, 3]); // 6

 */


// ((a, b, c) -> d) -> a -> b -> c -> d
const curry3 = f => x => y => z => f(x, y, z);


// API


module.exports = curry3;