"use strict";


/**
 * @name reverse applicator
 * @type higher order function
 * @status stable
 * @example

   @see ./A

 */


// a -> (a -> b) -> b
const T = x => f => f(x);


// a -> b -> (a -> b -> c) -> c
const T2 = x => y => f => f(x) (y);


// a -> b -> c -> (a -> b -> c -> d) -> d
const T3 = x => y => z => f => f(x) (y) (z);


// API


module.exports = {T, T2, T3};