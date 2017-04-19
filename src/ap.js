"use strict";


/**
 * @name applicative apply (composition in the second argument)
 * @type higher order function
 * @example

   const ap = f => g => x => f(x) (g(x));
   const sub = y => x => x - y;
   const inc = x => x + 1;

   ap(sub) (inc) (5); // 1

   // equivalent to:
   sub(5) (inc(5));
   sub(5) (6);
   6 - 5;
   
 */


// (r -> a -> b) -> (r -> a) -> r -> b
const ap = f => g => x => f(x) (g(x));


// API


module.exports = ap;