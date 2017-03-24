"use strict";


/**
 * @name apply
 * @type higher order function
 * @example
 *

   A(x => x * x) (5); // 25

 */


// (a -> b) -> a -> b
const A = f => x => f(x);


// (a -> a -> b) -> a -> a -> b
const A2 = f => x => y => f(x, y);


// ((a -> a -> b), a) -> a -> b
const A2_ = (f, x) => y => f(x, y);


// (a -> a -> a -> b) -> a -> a -> a -> b
const A3 = f => x => y => z => f(x, y, z);


// ((a -> a -> a -> b), a, a) -> a -> b
const A3_ = (f, x, y) => z => f(x, y, z);


// API


module.exports = {A, A2, A2_, A3, A3_};