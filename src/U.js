"use strict";


/**
 * @name recursive combinator
 * @type higher order function
 * @example
 *

   const fib = U(h => n => n === 0 ? n : n + h(h)(n - 1));
   fib(5); // 15

 */


// a -> b -> a|b
const U = f => f(f);


// (a, b) -> a|b
const and_ = (x, y) => x && y;


// API


module.exports = {and, and_};