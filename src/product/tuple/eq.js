"use strict";


/**
 * @name curry function
 * @type higher order function
 * @example
 *

   const add2 = curry((x, y) => x + y) (2);
   add2(3); // 5

 */

toArray
toTuple
compare
lt/lte
gt/gte

// ((a, b) -> c) -> a -> b -> c
const curry = f => x => y => f(x, y);


// ((a, b, c) -> d) -> a -> b -> c -> d
const curry3 = f => x => y => z => f(x, y, z);


// API


module.exports = {curry, curry3};