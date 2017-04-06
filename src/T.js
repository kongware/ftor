"use strict";


/**
 * @name thrush combinator (reverse application)
 * @type higher order function
 * @example
 *

   const fst = (x, y) => x;
   const snd = (x, y) => y;
   const pair = T2(2) (3);
   pair(fst); // 2
   pair(snd); // 3

 */


// a -> (a -> b) -> b
const T = x => f => f(x);


// a -> b -> (a -> b -> c) -> c
const T2 = x => y => f => f(x) (y);


// a -> b -> c -> (a -> b -> c -> d) -> d
const T3 = x => y => z => f => f(x) (y) (z);


// API


module.exports = {T, T2, T3};