"use strict";


/**
 * @name flip
 * @note cardinal combinator
 * @type higher order function
 * @example

   const C = f => y => x => f(x) (y);

   const sub = y => x => x - y;
   const sub2 = sub(2);

   sub2(10); // 8
   sub(10) (2); // -8
   C(sub) (10) (2); // 8

 */


// (a -> b -> c) -> b -> a -> c
const C = f => y => x => f(x) (y);


// (a -> b -> c -> d) -> a -> c -> b -> d
const C3 = f => z => x => y => f(x) (y) (z);


// API


module.exports = {C, C3};