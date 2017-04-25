"use strict";


/**
 * @name recursive combinator
 * @type higher order function
 * @example

   const U = f => f(f);
   const fib = U(h => n => n === 0 ? n : n + h(h) (n - 1));
   
   fib(5); // 15

 */


// (a -> a) -> a -> a
const U = f => f(f);


// API


module.exports = U;