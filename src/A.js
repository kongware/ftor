"use strict";


/**
 * @name apply combinator
 * @type higher order function
 * @example
 *

   A(x => x * x) (5); // 25

 */


// (a -> b) -> a -> b
const A = f => x => f(x);


// (a -> b -> c) -> a -> b -> c
const A2 = f => x => y => f(x) (y);


// (a -> b -> c -> d) -> a -> b -> c -> d
const A3 = f => x => y => z => f(x) (y) (z);


// API


module.exports = {A, A2, A3};