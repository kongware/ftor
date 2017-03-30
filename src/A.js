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


// ((a -> b -> c), a) -> b -> c
const A2_ = (f, x) => y => f(x) (y);


// (((a, b) -> c), a) -> b -> c
const A2__ = (f, x) => y => f(x, y);


// (a -> b -> c -> d) -> a -> b -> c -> d
const A3 = f => x => y => z => f(x) (y) (z);


// ((a -> b -> c -> d), a, b) -> c -> d
const A3_ = (f, x) => y => f(x) (y);


// (((a, b, c) -> d), a, b) -> c -> d
const A3__ = (f, x, y) => z => f(x, y, z);


// API


module.exports = {A, A2, A2_, A2__, A3, A3_, A3__};