"use strict";


/**
 * @name flip arguments
 * @type higher order function
 * @example

   const F = f => y => x => f(x) (y);

   const sub = y => x => x - y;
   const sub2 = sub(2);

   sub2(10); // 8
   sub(10) (2); // -8
   F(sub) (10) (2); // 8

 */


// (a -> b -> c) -> b -> a -> c
const F = f => y => x => f(x) (y);


// (a -> b -> c -> d) -> a -> c -> b -> d
const F3 = f => x => z => y => f(x) (z) (y);


// API


module.exports = {F, F3};